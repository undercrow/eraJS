import * as U from "../../erb/util";
import Statement from "../index";

export default class DelAllChara extends Statement {
	public constructor(arg: string) {
		super();
		U.arg0R0().tryParse(arg);
	}

	public *run() {
		throw new Error("DELALLCHARA is not implemented yet!");

		return null;
	}
}
