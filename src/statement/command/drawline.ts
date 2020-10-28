import type Statement from "../index";

export default class DrawLine implements Statement {
	public *run() {
		yield <const>{type: "line"};

		return null;
	}
}
