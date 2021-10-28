import * as assert from "../../assert";
export default class UnaryOp {
    target;
    op;
    postfix;
    constructor(target, op, postfix) {
        this.target = target;
        this.op = op;
        this.postfix = postfix;
    }
    async reduce(vm) {
        const cell = this.target.getCell(vm);
        const index = await this.target.reduceIndex(vm);
        const value = cell.get(vm, index);
        assert.number(value, `Operand of ${this.op} should be an integer`);
        switch (this.op) {
            case "++":
                cell.set(vm, value + 1, index);
                break;
            case "--":
                cell.set(vm, value - 1, index);
                break;
        }
        if (this.postfix) {
            return value;
        }
        else {
            switch (this.op) {
                case "++": return value + 1;
                case "--": return value - 1;
            }
        }
    }
}
