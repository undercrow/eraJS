import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Expr from "../expr";
import Form from "../expr/form";
import Statement from "../index";
import CallForm from "./callform";
import Jump from "./jump";

export default class JumpForm extends Statement {
	public arg: Lazy<[Form, Array<Expr | undefined>]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, CallForm.PARSER("("));
	}

	public *run(vm: VM) {
		const [targetExpr, argExpr] = this.arg.get();
		const target = targetExpr.reduce(vm);
		return yield* Jump.exec(vm, target, argExpr);
	}
}
