import * as U from "../../erb/util";
import Statement from "../index";

export default class LoadGlobal extends Statement {
	public constructor(arg: string) {
		super();
		U.arg0R0().tryParse(arg);
	}

	public *run() {
		yield <const>{type: "loadglobal"};

		return null;
	}
}
