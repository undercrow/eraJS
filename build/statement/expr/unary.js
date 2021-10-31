import * as assert from "../../assert";
export default class Unary {
    expr;
    op;
    constructor(op, expr) {
        this.op = op;
        this.expr = expr;
    }
    async reduce(vm) {
        const value = await this.expr.reduce(vm);
        assert.bigint(value, `Operand of ${this.op} should be an integer`);
        switch (this.op) {
            case "+": return value;
            case "-": return -value;
            case "!": return value === 0n ? 1n : 0n;
            // eslint-disable-next-line no-bitwise
            case "~": return ~value;
        }
    }
}
