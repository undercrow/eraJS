import type Statement from "../index";

export default class DebugClear implements Statement {
	public *run() {
		throw new Error("DEBUGCLEAR is not implemented yet!");
		return null;
	}
}
