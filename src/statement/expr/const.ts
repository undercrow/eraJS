import type {Leaf} from "../../value";
import type VM from "../../vm";
import type Expr from "./index";

export default class Const implements Expr {
	public value: Leaf;

	public constructor(value: Const["value"]) {
		this.value = value;
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async reduce(_vm: VM): Promise<Leaf> {
		return this.value;
	}
}
