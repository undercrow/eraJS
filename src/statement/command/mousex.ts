import * as U from "../../erb/util";
import Statement from "../index";

export default class MouseX extends Statement {
	public constructor(arg: string) {
		super();
		U.arg0R0().tryParse(arg);
	}

	public *run() {
		throw new Error("MOUSEX is not implemented yet!");

		return null;
	}
}
