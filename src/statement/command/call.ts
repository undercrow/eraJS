import {assert} from "../../assert";
import type VM from "../../vm";
import Assign from "../assign";
import Expr from "../expr";
import ConstInt from "../expr/const-int";
import ConstString from "../expr/const-string";
import Statement from "../index";

export default class Call extends Statement {
	public target: string;
	public arg: Expr[];

	public constructor(target: string, arg: Expr[]) {
		super();
		this.target = target;
		this.arg = arg;
	}

	public *run(vm: VM) {
		const arg = this.arg.map((a) => {
			const value = a.reduce(vm);
			if (typeof value === "string") {
				return new ConstString(value);
			} else {
				return new ConstInt(value);
			}
		});
		assert(vm.fnMap.has(this.target), `Function ${this.target} does not exist`);
		fnLoop: for (const fn of vm.fnMap.get(this.target)!) {
			vm.pushContext(fn);

			for (let i = 0; i < fn.arg.length; ++i) {
				const argExpr = fn.arg[i];
				const value = arg[i];
				if (argExpr instanceof Assign) {
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					yield* new Assign(argExpr.dest, value ?? argExpr.expr).run(vm);
				} else {
					yield* new Assign(argExpr, value).run(vm);
				}
			}

			const result = yield* fn.thunk.run(vm);
			vm.popContext();

			switch (result?.type) {
				case "begin": return result;
				case "goto": return result;
				case "break": return result;
				case "continue": return result;
				case "return": {
					vm.setValue(result.value, "RESULT", 0);
					break fnLoop;
				}
				case undefined: continue fnLoop;
			}
		}
		vm.setValue(0, "RESULT", 0);
		return null;
	}
}
