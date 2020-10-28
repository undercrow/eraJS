import type Statement from "../index";

export default class SaveGlobal implements Statement {
	public *run() {
		throw new Error("SAVEGLOBAL is not implemented yet!");

		return null;
	}
}
