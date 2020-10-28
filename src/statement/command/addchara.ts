import type VM from "../../vm";
import type Expr from "../expr";
import type Statement from "../index";

export default class StrLen implements Statement {
	public charaters: Expr[];

	public constructor(characters: Expr[]) {
		this.charaters = characters;
	}

	public *run(_vm: VM) {
		// eslint-disable-next-line no-console
		console.error("ADDCHARA is not implemented yet!");

		return null;
	}
}
