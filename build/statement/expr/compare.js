import * as assert from "../../assert";
export default class Compare {
    left;
    right;
    op;
    constructor(op, left, right) {
        this.op = op;
        this.left = left;
        this.right = right;
    }
    async reduce(vm) {
        const left = await this.left.reduce(vm);
        const right = await this.right.reduce(vm);
        if (typeof left !== typeof right) {
            assert.cond(false, `Type of left and right operand of ${this.op} should be equal`);
        }
        switch (this.op) {
            case "==": return left === right ? 1n : 0n;
            case "!=": return left !== right ? 1n : 0n;
        }
    }
}
