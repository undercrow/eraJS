import * as U from "../../erb/util";
import Statement from "../index";

const PARSER = U.arg1R1(U.Identifier);
export default class Begin extends Statement {
	public target: string;

	public constructor(arg: string) {
		super();
		this.target = PARSER.tryParse(arg);
	}

	public *run() {
		return <const>{
			type: "begin",
			keyword: this.target,
		};
	}
}
