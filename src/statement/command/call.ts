import P from "parsimmon";

import * as assert from "../../assert";
import * as C from "../../parser/const";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import {Leaf} from "../../value";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";

export default class Call extends Statement {
	public static PARSER = P.alt<[string, Array<Expr | undefined>]>(
		U.arg1R1(P.seq(
			C.Identifier.skip(C.WS0),
			U.wrap("(", ")", U.sepBy0(",", U.optional(X.expr))),
		)),
		U.argNR1(C.Identifier, U.optional(X.expr)).map(([f, ...r]) => [f, r]),
	);

	public static async *exec(vm: VM, target: string, argExpr: Array<Expr | undefined>) {
		const realTarget = target.toUpperCase();
		assert.cond(vm.fnMap.has(realTarget), `Function ${realTarget} does not exist`);

		const arg: Array<Leaf | undefined> = [];
		for (const a of argExpr) {
			arg.push(await a?.reduce(vm));
		}
		const result = yield* vm.fnMap.get(realTarget)!.run(vm, arg);
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
			case undefined: {
				vm.getValue("RESULT").set(vm, 0n, [0]);
				return null;
			}
		}
	}

	public arg: Lazy<[string, Array<Expr | undefined>]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, Call.PARSER);
	}

	public async *run(vm: VM) {
		const [target, argExpr] = this.arg.get();

		return yield* Call.exec(vm, target, argExpr);
	}
}
