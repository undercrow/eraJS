import {assertNumber} from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class ClearLine extends Statement {
	public arg: Lazy<Expr>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, U.arg1R1(E.expr));
	}

	public *run(vm: VM) {
		const count = this.arg.get().reduce(vm);
		assertNumber(count, "Argument of CLEARLINE must be an integer!");

		yield <const>{type: "clearline", count};

		const lineCount = vm.getValue("LINECOUNT").get(vm, [0]) as number;
		vm.getValue("LINECOUNT").set(vm, lineCount - count, []);

		return null;
	}
}
