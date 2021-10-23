import * as U from "../../parser/util";
import Slice from "../../slice";
import Statement, {EraGenerator} from "../index";

const PARSER = U.arg0R0();
export default class LoadGame extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	public *run(): EraGenerator {
		return {
			type: "begin",
			keyword: "LOADGAME",
		};
	}
}
