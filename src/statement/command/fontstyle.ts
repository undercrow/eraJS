import {assertNumber} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R1(E.expr);
export default class FontStyle extends Statement {
	public value: Lazy<Expr>;

	public constructor(arg: string) {
		super();
		this.value = new Lazy(arg, PARSER);
	}

	public *run(vm: VM) {
		const value = this.value.get().reduce(vm);
		assertNumber(value, "Argument of FONTSTYLE must be an integer!");

		/* eslint-disable no-bitwise */
		vm.font.bold = (value & (1 << 0)) !== 0;
		vm.font.italic = (value & (1 << 1)) !== 0;
		vm.font.strike = (value & (1 << 2)) !== 0;
		vm.font.underline = (value & (1 << 3)) !== 0;
		/* eslint-enable no-bitwise */

		return null;
	}
}
