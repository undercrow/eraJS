import * as U from "../../erb/util";
import Statement from "../index";

export default class Continue extends Statement {
	public constructor(arg: string) {
		super();
		U.arg0R0().tryParse(arg);
	}

	public *run() {
		return <const>{
			type: "continue",
		};
	}
}
