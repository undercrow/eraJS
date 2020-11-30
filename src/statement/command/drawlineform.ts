import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Form from "../expr/form";
import Statement from "../index";

export default class DrawLineForm extends Statement {
	public arg: Lazy<Form>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, U.arg1R1(E.form()));
	}

	public *run(vm: VM) {
		const value = this.arg.get().reduce(vm);

		yield <const>{
			type: "line",
			value,
		};

		return null;
	}
}
