import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class PutForm extends Statement {
	public arg: Lazy<Expr>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, U.arg1R1(E.form()));
	}

	public *run(_vm: VM) {
		throw new Error("PUTFORM is not implemented yet");

		return null;
	}
}
