import type Statement from "../index";

export default class SaveGame implements Statement {
	public *run() {
		throw new Error("SAVEGAME is not implemented yet!");

		return null;
	}
}
