import Lazy from "../../lazy";
import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Slice from "../../slice";
import Statement from "../index";

const PARSER = U.arg1R1(C.Identifier);
export default class Begin extends Statement {
	public arg: Lazy<string>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run() {
		return <const>{
			type: "begin",
			keyword: this.arg.get(),
		};
	}
}
