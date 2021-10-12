import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Form from "../expr/form";
import Statement from "../index";

const PARSER = U.arg1R1(E.form[""]);
export default class DrawLineForm extends Statement {
	public arg: Lazy<Form>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, PARSER);
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
