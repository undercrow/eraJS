import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Variable from "../expr/variable";
import Statement from "../index";

const PARSER = U.arg2R1(E.variable, U.alt("FORWARD", "BACK"));
export default class SortChara extends Statement {
	public value: Lazy<[Variable, "FORWARD" | "BACK" | undefined]>;

	public constructor(raw: string) {
		super();
		this.value = new Lazy(raw, PARSER);
	}

	public *run(_vm: VM) {
		throw new Error("SORTCHARA is not implemented yet!");

		return null;
	}
}
