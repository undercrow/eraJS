import type VM from "../../vm";
import type Expr from "./index";

export default class ConstIntExpr implements Expr {
	public value: number;

	public constructor(value: number) {
		this.value = value;
	}

	public reduce(_vm: VM): number {
		return this.value;
	}
}
