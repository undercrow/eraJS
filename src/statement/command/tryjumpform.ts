import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
import CallForm from "./callform";
import Jump from "./jump";

export default class TryJumpForm extends Statement {
	public arg: CallForm["arg"];

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, CallForm.PARSER("("));
	}

	public async *run(vm: VM) {
		const [targetExpr, argExpr] = this.arg.get();
		const target = (await targetExpr.reduce(vm)).toUpperCase();
		if (vm.fnMap.has(target)) {
			return yield* Jump.exec(vm, target, argExpr);
		}

		return null;
	}
}
