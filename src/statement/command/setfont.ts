import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R0(E.expr);
export default class SetFont extends Statement {
	public font: Lazy<Expr | undefined>;

	public constructor(arg: string) {
		super();
		this.font = new Lazy(arg, PARSER);
	}

	public *run(vm: VM) {
		// TODO: use default font
		const font = this.font.get()?.reduce(vm) ?? "";
		assert.string(font, "Argument of SETFONT must be a string");

		vm.font.name = font;

		return null;
	}
}
