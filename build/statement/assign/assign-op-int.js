import * as assert from "../../assert";
import Statement from "../index";
export default class OpAssign extends Statement {
    dest;
    operator;
    expr;
    constructor(dest, operator, expr) {
        super();
        this.dest = dest;
        this.operator = operator;
        this.expr = expr;
    }
    *run(vm) {
        const dest = this.dest.getCell(vm);
        const index = this.dest.reduceIndex(vm);
        const original = dest.get(vm, index);
        const value = this.expr.reduce(vm);
        assert.number(value, `Right operand of ${this.operator} should be an integer`);
        switch (this.operator) {
            case "*=":
                dest.set(vm, original * value, index);
                break;
            case "/=":
                dest.set(vm, Math.floor(original / value), index);
                break;
            case "%=":
                dest.set(vm, original % value, index);
                break;
            case "+=":
                dest.set(vm, original + value, index);
                break;
            case "-=":
                dest.set(vm, original - value, index);
                break;
            // eslint-disable-next-line no-bitwise
            case "&=":
                dest.set(vm, original & value, index);
                break;
            // eslint-disable-next-line no-bitwise
            case "|=":
                dest.set(vm, original | value, index);
                break;
            // eslint-disable-next-line no-bitwise
            case "^=":
                dest.set(vm, original ^ value, index);
                break;
        }
        return null;
    }
}
