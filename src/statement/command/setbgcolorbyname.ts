import * as U from "../../parser/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg1R1(U.charSeq());
export default class SetBgColorByName extends Statement {
	public arg: Lazy<string>;

	public constructor(raw: string) {
		super();
		this.arg = new Lazy(raw, PARSER);
	}

	public *run(_vm: VM) {
		throw new Error("SETBGCOLORBYNAME is not implemented yet!");

		return null;
	}
}
