import type VM from "../../vm";
import Expr from "../expr";
import Form from "../expr/form";
import Statement from "../index";
import Call from "./call";
import CallForm from "./callform";

export default class TryCallForm extends Statement {
	public static parse(raw: string): TryCallForm {
		const [target, arg] = CallForm.compileArg(raw, "(");
		return new TryCallForm(target, arg);
	}

	public target: Form;
	public arg: (Expr | undefined)[];

	public constructor(target: Form, arg: TryCallForm["arg"]) {
		super();
		this.target = target;
		this.arg = arg;
	}

	public *run(vm: VM) {
		const target = this.target.reduce(vm).toUpperCase();
		if (vm.fnMap.has(target)) {
			return yield* new Call(target, this.arg).run(vm);
		}

		return null;
	}
}
