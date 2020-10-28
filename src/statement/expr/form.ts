import type VM from "../../vm";
import type Expr from "./index";

export default class Form implements Expr {
	public expr: Array<string | Expr>;

	public constructor(expr: Array<string | Expr>) {
		this.expr = expr;
	}

	public reduce(vm: VM): string {
		let result = "";
		for (const expr of this.expr) {
			if (typeof expr === "string") {
				result += expr;
			} else {
				const value = expr.reduce(vm);
				// eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
				switch (typeof value) {
					case "string": result += value; break;
					case "number": result += value.toString(); break;
				}
			}
		}

		return result;
	}
}
