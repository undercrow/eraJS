import * as assert from "../../assert";
import Lazy from "../../lazy";
import Slice from "../../slice";
import {Leaf} from "../../value";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
import Call from "./call";

export default class CallF extends Statement {
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
			case "return": return null;
			case "quit": return result;
			case undefined: return null;
		}
	}

	public arg: Lazy<[string, Array<Expr | undefined>]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, Call.PARSER);
	}

	public async *run(vm: VM) {
		const [target, argExpr] = this.arg.get();

		return yield* CallF.exec(vm, target, argExpr);
	}
}
