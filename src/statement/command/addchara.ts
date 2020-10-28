import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class StrLen extends Statement {
	public charaters: Expr[];

	public constructor(characters: Expr[]) {
		super();
		this.charaters = characters;
	}

	public *run(_vm: VM) {
		// eslint-disable-next-line no-console
		console.error("ADDCHARA is not implemented yet!");

		return null;
	}
}
