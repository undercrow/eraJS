import * as assert from "../../assert";
import type VM from "../../vm";
import type Expr from "./index";

export default class Form implements Expr {
	public expr: Array<{
		value: string | Expr;
		display?: Expr;
		align?: "LEFT" | "RIGHT";
	}>;

	public constructor(expr: Form["expr"]) {
		const merged: Form["expr"] = [];
		for (const e of expr) {
			const last = merged[merged.length - 1];
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (last != null && typeof last.value === "string" && typeof e.value === "string") {
				last.value += e.value;
			} else {
				merged.push(e);
			}
		}

		this.expr = merged;
	}

	public async reduce(vm: VM): Promise<string> {
		let result = "";
		for (const expr of this.expr) {
			let value: string;
			if (typeof expr.value === "string") {
				value = expr.value;
			} else {
				const reduced = await expr.value.reduce(vm);
				// eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
				switch (typeof reduced) {
					case "string": value = reduced; break;
					case "bigint": value = reduced.toString(); break;
				}
			}

			if (expr.display != null) {
				const display = await expr.display.reduce(vm);
				assert.bigint(display, "Display size of form string should be an integer");

				if (expr.align == null || expr.align === "LEFT") {
					value = value.padStart(Number(display), " ");
				} else {
					value = value.padEnd(Number(display), " ");
				}
			}

			result += value;
		}

		return result;
	}
}
