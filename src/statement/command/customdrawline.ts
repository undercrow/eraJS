import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";

const PARSER = U.arg1R1(U.charSeq());
export default class CustomDrawLine extends Statement {
	public arg: Lazy<string>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, PARSER);
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
