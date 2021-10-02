import {assert} from "../../assert";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
import Call from "./call";

export default class CallF extends Statement {
	public static parse(raw: string): CallF {
		const [target, arg] = Call.compileArg(raw);
		return new CallF(target, arg);
	}

	public target: string;
	public arg: (Expr | undefined)[];

	public constructor(target: string, arg: CallF["arg"]) {
		super();
		this.target = target;
		this.arg = arg;
	}

	public *run(vm: VM) {
		const target = this.target.toUpperCase();
		assert(vm.fnMap.has(target), `Function ${target} does not exist`);

		const arg = this.arg.map((a) => a?.reduce(vm));
		const result = yield* vm.fnMap.get(target)!.run(vm, arg);
		switch (result?.type) {
			case "begin": return result;
			case "goto": return result;
			case "break": return result;
			case "continue": return result;
			case "throw": return result;
			case "return": return null;
			case "quit": return result;
			case undefined: return null;
		}
	}
}
