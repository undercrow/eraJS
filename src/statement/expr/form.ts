import {assertNumber} from "../../assert";
import type VM from "../../vm";
import type Expr from "./index";

export default class Form implements Expr {
	public expr: Array<{
		value: string | Expr;
		display?: Expr;
		align?: "LEFT" | "RIGHT";
	}>;

	public constructor(expr: Form["expr"]) {
		this.expr = expr;
	}

	public reduce(vm: VM): string {
		let result = "";
		for (const expr of this.expr) {
			let value: string;
			if (typeof expr.value === "string") {
				value = expr.value;
			} else {
				const reduced = expr.value.reduce(vm);
				// eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
				switch (typeof reduced) {
					case "string": value = reduced; break;
					case "number": value = reduced.toString(); break;
				}
			}

			if (expr.display != null) {
				const display = expr.display.reduce(vm);
				assertNumber(display, "Display size of form string should be an integer");

				if (expr.align == null || expr.align === "LEFT") {
					value = value.padStart(display, " ");
				} else {
					value = value.padEnd(display, " ");
				}
			}

			result += value;
		}

		return result;
	}
}
