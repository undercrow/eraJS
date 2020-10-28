import type Statement from "../index";

export default class LoadGlobal implements Statement {
	public *run() {
		yield <const>{type: "loadglobal"};

		return null;
	}
}
