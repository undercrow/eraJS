import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
import Call from "./call";
import CallForm from "./callform";

export default class TryCallForm extends Statement {
	public arg: CallForm["arg"];

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, CallForm.PARSER("(,"));
	}

	public async *run(vm: VM) {
		const [targetExpr, argExpr] = this.arg.get();
		const target = (await targetExpr.reduce(vm)).toUpperCase();
		if (vm.fnMap.has(target)) {
			return yield* Call.exec(vm, target, argExpr);
		}

		return null;
	}
}
