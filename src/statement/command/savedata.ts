import {assertNumber, assertString} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class SaveData extends Statement {
	public index: Expr;
	public comment: Expr;

	public constructor(index: Expr, comment: Expr) {
		super();
		this.index = index;
		this.comment = comment;
	}

	public *run(vm: VM) {
		const index = this.index.reduce(vm);
		assertNumber(index, "1st argument of SAVEDATA must be a number");
		const comment = this.comment.reduce(vm);
		assertString(comment, "2nd argument of SAVEDATA must be a string");

		throw new Error("SAVEDATA is not implemented yet!");

		return null;
	}
}
