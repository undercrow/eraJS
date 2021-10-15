import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import Statement from "../index";

const PARSER = U.arg1R1(U.charSeq());
export default class CustomDrawLine extends Statement {
	public arg: Lazy<string>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run() {
		const value = this.arg.get();

		yield <const>{
			type: "line",
			value,
		};

		return null;
	}
}
