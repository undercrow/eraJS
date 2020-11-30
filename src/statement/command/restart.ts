import * as U from "../../erb/util";
import Fn from "../../fn";
import Statement from "../index";

export default class Restart extends Statement {
	public constructor(arg: string) {
		super();
		U.arg0R0().tryParse(arg);
	}

	public *run() {
		return <const>{
			type: "goto",
			label: Fn.START_OF_FN,
		};
	}
}
