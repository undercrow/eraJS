import * as U from "../../erb/util";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class LoadGame extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	public *run() {
		yield <const>{type: "loadgame"};

		return null;
	}
}
