import Statement from "../index";

export default class LoadGame extends Statement {
	public *run() {
		yield <const>{type: "loadgame"};

		return null;
	}
}
