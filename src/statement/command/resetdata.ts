import type Statement from "../index";

export default class ResetData implements Statement {
	public *run() {
		yield <const>{type: "resetdata"};

		return null;
	}
}
