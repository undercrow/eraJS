import * as E from "../../error";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Variable from "../expr/variable";
import Statement from "../index";

const PARSER = U.arg2R0(X.variable, U.alt("FORWARD", "BACK"));
export default class SortChara extends Statement {
	public arg: Lazy<[Variable | undefined, "FORWARD" | "BACK" | undefined]>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run(_vm: VM) {
		throw E.notImpl("SORTCHARA");

		return null;
	}
}
