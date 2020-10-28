import Statement from "../index";

export default class DrawLine extends Statement {
	public *run() {
		yield <const>{type: "line"};

		return null;
	}
}
