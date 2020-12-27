import P from "parsimmon";

import {assert} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";

const PARSER = P.alt(
	U.arg1R1(P.seq(U.Identifier.skip(U.WS0), U.wrap("(", ")", U.sepBy0(",", U.optional(E.expr))))),
	U.argNR1(U.Identifier, U.optional(E.expr)).map(([f, ...r]) => [f, r]),
);
export default class Call extends Statement {
	public static parse(raw: string): Call {
		const [target, arg] = Call.compileArg(raw);
		return new Call(target, arg);
	}

	public static compileArg(arg: string): [string, (Expr | undefined)[]] {
		return PARSER.tryParse(arg) as [string, (Expr | undefined)[]];
	}

	public target: string;
	public arg: (Expr | undefined)[];

	public constructor(target: string, arg: Call["arg"]) {
		super();
		this.target = target;
		this.arg = arg;
	}

	public *run(vm: VM) {
		const target = this.target.toUpperCase();
		assert(vm.fnMap.has(target), `Function ${target} does not exist`);

		const arg = this.arg.map((a) => a?.reduce(vm));
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
