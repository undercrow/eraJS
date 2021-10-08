import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

const PARSER = U.arg2R2(E.expr, E.expr);
export default class SwapChara extends Statement {
	public expr: Lazy<[Expr, Expr]>;

	public constructor(raw: string) {
		super();
		this.expr = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		const [leftExpr, rightExpr] = this.expr.get();
		const left = leftExpr.reduce(vm);
		assert.number(left, "1st argument of SWAPCHARA must be a number");
		const right = rightExpr.reduce(vm);
		assert.number(right, "2nd argument of SWAPCHARA must be a number");

		const temp = vm.characterList[left];
		vm.characterList[left] = vm.characterList[right];
		vm.characterList[right] = temp;

		return null;
	}
}
