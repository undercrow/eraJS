import * as assert from "../../assert";
export default class Ternary {
    condition;
    left;
    right;
    constructor(condition, left, right) {
        this.condition = condition;
        this.left = left;
        this.right = right;
    }
    async reduce(vm) {
        const condition = await this.condition.reduce(vm);
        assert.bigint(condition, "Condition of ternary operator should be an integer");
        return condition !== 0n ? this.left.reduce(vm) : this.right.reduce(vm);
    }
}
