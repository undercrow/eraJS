import Statement from "../index";

export default class LoadGlobal extends Statement {
	public *run() {
		yield <const>{type: "loadglobal"};

		return null;
	}
}
