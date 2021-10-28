import * as U from "../../parser/util";
import Slice from "../../slice";
import Statement, {EraGenerator} from "../index";

const PARSER = U.arg0R0();
export default class SaveGame extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async *run(): EraGenerator {
		return {
			type: "begin",
			keyword: "SAVEGAME",
		};
	}
}
