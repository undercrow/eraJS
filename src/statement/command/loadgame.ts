import type Statement from "../index";

export default class LoadGame implements Statement {
	public *run() {
		yield <const>{type: "loadgame"};

		return null;
	}
}
