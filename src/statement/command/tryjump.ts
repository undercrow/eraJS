import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
import Call from "./call";
import Jump from "./jump";

export default class TryJump extends Statement {
	public arg: Jump["arg"];

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, Call.PARSER);
	}

	public *run(vm: VM) {
		const [target, argExpr] = this.arg.get();
		const realTarget = target.toUpperCase();
		if (vm.fnMap.has(realTarget)) {
			return yield* Jump.exec(vm, realTarget, argExpr);
		}

		return null;
	}
}
