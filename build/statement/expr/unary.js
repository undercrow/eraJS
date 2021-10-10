import * as assert from "../../assert";
export default class Unary {
    expr;
    op;
    constructor(op, expr) {
        this.op = op;
        this.expr = expr;
    }
    reduce(vm) {
        const value = this.expr.reduce(vm);
        assert.number(value, `Operand of ${this.op} should be an integer`);
        switch (this.op) {
            case "+": return value;
            case "-": return -value;
            case "!": return value === 0 ? 1 : 0;
            // eslint-disable-next-line no-bitwise
            case "~": return ~value;
        }
    }
}
