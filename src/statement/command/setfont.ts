import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R0(X.expr);
export default class SetFont extends Statement {
	public arg: Lazy<Expr | undefined>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		// TODO: use default font
		const font = await this.arg.get()?.reduce(vm) ?? "";
		assert.string(font, "Argument of SETFONT must be a string");

		vm.font.name = font;

		return null;
	}
}
