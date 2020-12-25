import * as U from "../../erb/util";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class Break extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	public *run() {
		return <const>{
			type: "break",
		};
	}
}
