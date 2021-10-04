import Lazy from "../../lazy";
import type VM from "../../vm";
import Expr from "../expr";
import Form from "../expr/form";
import Statement from "../index";
import Call from "./call";
import CallForm from "./callform";

export default class TryCallForm extends Statement {
	public arg: Lazy<[Form, Array<Expr | undefined>]>;

	public constructor(raw: string) {
		super();
		this.arg = new Lazy(raw, CallForm.PARSER("(,"));
	}

	public *run(vm: VM) {
		const [targetExpr, argExpr] = this.arg.get();
		const target = targetExpr.reduce(vm);
		if (vm.fnMap.has(target)) {
			return yield* Call.exec(vm, target, argExpr);
		}

		return null;
	}
}
