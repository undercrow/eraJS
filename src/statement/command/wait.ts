import Statement from "../index";

export default class Wait extends Statement {
	public *run() {
		yield <const>{type: "wait"};

		return null;
	}
}
