import * as assert from "../../assert";
export default class Form {
    expr;
    constructor(expr) {
        const merged = [];
        for (const e of expr) {
            const last = merged[merged.length - 1];
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (last != null && typeof last.value === "string" && typeof e.value === "string") {
                last.value += e.value;
            }
            else {
                merged.push(e);
            }
        }
        this.expr = merged;
    }
    reduce(vm) {
        let result = "";
        for (const expr of this.expr) {
            let value;
            if (typeof expr.value === "string") {
                value = expr.value;
            }
            else {
                const reduced = expr.value.reduce(vm);
                // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
                switch (typeof reduced) {
                    case "string":
                        value = reduced;
                        break;
                    case "number":
                        value = reduced.toString();
                        break;
                }
            }
            if (expr.display != null) {
                const display = expr.display.reduce(vm);
                assert.number(display, "Display size of form string should be an integer");
                if (expr.align == null || expr.align === "LEFT") {
                    value = value.padStart(display, " ");
                }
                else {
                    value = value.padEnd(display, " ");
                }
            }
            result += value;
        }
        return result;
    }
}
