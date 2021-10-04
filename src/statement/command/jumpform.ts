import type VM from "../../vm";
import Expr from "../expr";
import Form from "../expr/form";
import Statement from "../index";
import CallForm from "./callform";
import Jump from "./jump";

export default class JumpForm extends Statement {
	public static parse(raw: string): JumpForm {
		const [target, arg] = CallForm.PARSER("(").tryParse(raw);
		return new JumpForm(target, arg);
	}

	public target: Form;
	public arg: (Expr | undefined)[];

	public constructor(target: Form, arg: JumpForm["arg"]) {
		super();
		this.target = target;
		this.arg = arg;
	}

	public *run(vm: VM) {
		const target = this.target.reduce(vm);
		return yield* new Jump(target, this.arg).run(vm);
	}
}
