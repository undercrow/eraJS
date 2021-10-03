import { assert } from "../../assert";
export default class Compare {
    left;
    right;
    op;
    constructor(op, left, right) {
        this.op = op;
        this.left = left;
        this.right = right;
    }
    reduce(vm) {
        const left = this.left.reduce(vm);
        const right = this.right.reduce(vm);
        if (typeof left !== typeof right) {
            assert(false, `Type of left and right operand of ${this.op} should be equal`);
        }
        switch (this.op) {
            case "==": return left === right ? 1 : 0;
            case "!=": return left !== right ? 1 : 0;
        }
    }
}
