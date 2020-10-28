import {assertString} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import type Statement from "../index";

export default class SetFont implements Statement {
	public font?: Expr;

	public constructor(font?: Expr) {
		this.font = font;
	}

	public *run(vm: VM) {
		// TODO: use default font
		const font = this.font != null ? this.font.reduce(vm) : "";
		assertString(font, "Argument of SETFONT must be a string");

		vm.font.name = font;

		return null;
	}
}
