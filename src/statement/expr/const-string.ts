import type VM from "../../vm";
import type Expr from "./index";

export default class ConstStringExpr implements Expr {
	public value: string;

	public constructor(value: string) {
		this.value = value;
	}

	public reduce(_vm: VM): string {
		return this.value;
	}
}
