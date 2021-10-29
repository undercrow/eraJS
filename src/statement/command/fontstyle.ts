import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R1(X.expr);
export default class FontStyle extends Statement {
	public arg: Lazy<Expr>;

	public constructor(raw: Slice) {
		super(raw);

		this.arg = new Lazy(raw, PARSER);
	}

	public async *run(vm: VM) {
		const value = await this.arg.get().reduce(vm);
		assert.number(value, "Argument of FONTSTYLE must be an integer!");

		/* eslint-disable no-bitwise */
		vm.printer.font.bold = (value & (1 << 0)) !== 0;
		vm.printer.font.italic = (value & (1 << 1)) !== 0;
		vm.printer.font.strike = (value & (1 << 2)) !== 0;
		vm.printer.font.underline = (value & (1 << 3)) !== 0;
		/* eslint-enable no-bitwise */

		return null;
	}
}
