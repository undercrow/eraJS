import Statement from "../index";

export default class DebugClear extends Statement {
	public *run() {
		throw new Error("DEBUGCLEAR is not implemented yet!");
		return null;
	}
}
