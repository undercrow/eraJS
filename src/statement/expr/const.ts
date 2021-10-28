import type VM from "../../vm";
import type Expr from "./index";

export default class Const implements Expr {
	public value: number | string;

	public constructor(value: Const["value"]) {
		this.value = value;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async reduce(_vm: VM): Promise<number | string> {
		return this.value;
	}
}
