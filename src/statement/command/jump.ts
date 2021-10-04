import {assert} from "../../assert";
import Lazy from "../../lazy";
import type VM from "../../vm";
import Expr from "../expr";
import Statement from "../index";
import Call from "./call";

export default class Jump extends Statement {
	public static *exec(vm: VM, target: string, argExpr: Array<Expr | undefined>) {
		const realTarget = target.toUpperCase();
		assert(vm.fnMap.has(realTarget), `Function ${realTarget} does not exist`);

		const arg = argExpr.map((a) => a?.reduce(vm));
		return yield* vm.fnMap.get(realTarget)!.run(vm, arg);
	}

	public arg: Lazy<[string, Array<Expr | undefined>]>;

	public constructor(raw: string) {
		super();
		this.arg = new Lazy(raw, Call.PARSER);
	}

	public *run(vm: VM) {
		const [target, argExpr] = this.arg.get();
		return yield* Jump.exec(vm, target, argExpr);
	}
}
