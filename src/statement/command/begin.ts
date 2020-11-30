import * as U from "../../erb/util";
import Statement from "../index";

export default class Begin extends Statement {
	public target: string;

	public constructor(arg: string) {
		super();
		this.target = U.arg1R1(U.Identifier).tryParse(arg);
	}

	public *run() {
		return <const>{
			type: "begin",
			keyword: this.target,
		};
	}
}
