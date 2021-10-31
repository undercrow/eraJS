import * as assert from "../../assert";
import Lazy from "../../lazy";
import * as X from "../../parser/expr";
import Statement from "../index";
const PARSER = X.expr;
export default class AssignOpInt extends Statement {
    dest;
    operator;
    arg;
    constructor(dest, operator, raw) {
        super(raw);
        this.dest = dest;
        this.operator = operator;
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const dest = this.dest.getCell(vm);
        const index = await this.dest.reduceIndex(vm);
        const original = dest.get(vm, index);
        const value = await this.arg.get().reduce(vm);
        assert.bigint(value, `Right operand of ${this.operator} should be a number`);
        switch (this.operator) {
            case "*=":
                dest.set(vm, original * value, index);
                break;
            case "/=":
                dest.set(vm, original / value, index);
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
