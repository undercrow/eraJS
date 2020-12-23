import P from "parsimmon";

import {assert} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";

export default class Call extends Statement {
	public static parse(raw: string): Call {
		const [target, arg] = Call.compileArg(raw);
		return new Call(target, arg);
	}

	public static compileArg(arg: string): [string, Expr[]] {
		const parser = P.alt(
			U.arg1R1(P.seq(U.Identifier, U.wrap("(", U.sepBy0(",", E.expr), ")"))),
			U.argNR1(U.Identifier, E.expr).map(([f, ...r]) => [f, r]),
		);

		return parser.tryParse(arg) as [string, Expr[]];
	}

	public target: string;
	public arg: Expr[];

	public constructor(target: string, arg: Expr[]) {
		super();
		this.target = target;
		this.arg = arg;
	}

	public *run(vm: VM) {
		const target = this.target.toUpperCase();
		assert(vm.fnMap.has(target), `Function ${target} does not exist`);

		const arg = this.arg.map((a) => a.reduce(vm));
		for (const fn of vm.fnMap.get(target)!) {
			const result = yield* fn.run(vm, arg);
			switch (result?.type) {
				case "begin": return result;
				case "goto": return result;
				case "break": return result;
				case "continue": return result;
				case "throw": return result;
				case "return": {
					for (let i = 0; i < result.value.length; ++i) {
						vm.getValue("RESULT").set(vm, result.value[i], [i]);
					}
					return null;
				}
				case "quit": return result;
				case undefined: continue;
			}
		}
		vm.getValue("RESULT").set(vm, 0, [0]);
		return null;
	}
}
