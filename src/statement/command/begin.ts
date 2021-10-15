import Lazy from "../../lazy";
import * as U from "../../parser/util";
import Slice from "../../slice";
import Statement from "../index";

const PARSER = U.arg1R1(U.Identifier);
export default class Begin extends Statement {
	public arg: Lazy<string>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public *run() {
		return <const>{
			type: "begin",
			keyword: this.arg.get(),
		};
	}
}
