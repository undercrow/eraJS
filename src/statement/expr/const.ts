import type VM from "../../vm";
import type Expr from "./index";

export default class Const implements Expr {
	public value: number | string;

	public constructor(value: Const["value"]) {
		this.value = value;
	}

	public reduce(_vm: VM): number | string {
		return this.value;
	}
}
