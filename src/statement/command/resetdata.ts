import Statement from "../index";

export default class ResetData extends Statement {
	public *run() {
		yield <const>{type: "resetdata"};

		return null;
	}
}
