import * as assert from "../../assert";
import * as E from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Int1DValue from "../../value/int-1d";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg1R1(E.expr);
export default class ResetStain extends Statement {
	public arg: Lazy<Expr>;

	public constructor(arg: string) {
		super();
		this.arg = new Lazy(arg, PARSER);
	}

	public *run(vm: VM) {
		const numExpr = this.arg.get();
		const num = numExpr.reduce(vm);
		assert.number(num, "1st Argument of RESET_STAIN should be an integer");

		assert.cond(vm.characterList.length > num, `Character #${num} does not exist`);
		const character = vm.characterList[num];

		character.getValue<Int1DValue>("STAIN").reset([0, 0, 2, 1, 8]);

		return null;
	}
}
