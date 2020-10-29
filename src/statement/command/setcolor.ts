import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

export default class Print extends Statement {
	public color: Expr;

	public constructor(color: Expr) {
		super();
		this.color = color;
	}

	public *run(vm: VM) {
		const color = this.color.reduce(vm);
		assertNumber(color, "Argument of SETCOLOR must be an integer");

		vm.color.front.r = Math.floor(color / 0x010000);
		vm.color.front.b = Math.floor((color % 0x010000) / 0x000100);
		vm.color.front.g = Math.floor((color % 0x000100) / 0x000001);

		return null;
	}
}
