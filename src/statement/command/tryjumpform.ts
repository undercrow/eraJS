import type VM from "../../vm";
import Expr from "../expr";
import Form from "../expr/form";
import Statement from "../index";
import CallForm from "./callform";
import Jump from "./jump";

export default class TryJumpForm extends Statement {
	public static parse(raw: string): TryJumpForm {
		const [target, arg] = CallForm.PARSER("(").tryParse(raw);
		return new TryJumpForm(target, arg);
	}

	public target: Form;
	public arg: (Expr | undefined)[];

	public constructor(target: Form, arg: TryJumpForm["arg"]) {
		super();
		this.target = target;
		this.arg = arg;
	}

	public *run(vm: VM) {
		const target = this.target.reduce(vm).toUpperCase();
		if (vm.fnMap.has(target)) {
			return yield* Jump.exec(vm, target, this.arg);
		}

		return null;
	}
}
