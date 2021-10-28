import * as assert from "../../assert";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
import Call from "./call";

export default class Jump extends Statement {
	public static async *exec(vm: VM, target: string, argExpr: Array<Expr | undefined>) {
		const realTarget = target.toUpperCase();
		assert.cond(vm.fnMap.has(realTarget), `Function ${realTarget} does not exist`);

		const arg: Array<string | number | undefined> = [];
		for (const a of argExpr) {
			arg.push(await a?.reduce(vm));
		}
		return yield* vm.fnMap.get(realTarget)!.run(vm, arg);
	}

	public arg: Lazy<[string, Array<Expr | undefined>]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, Call.PARSER);
	}

	public async *run(vm: VM) {
		const [target, argExpr] = this.arg.get();
		return yield* Jump.exec(vm, target, argExpr);
	}
}
