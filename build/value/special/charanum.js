import * as assert from "../../assert";
import * as E from "../../error";
export default class CharaNumValue {
    type = "number";
    name = "CHARANUM";
    value;
    constructor() {
        // Do nothing
    }
    reset() {
        throw E.internal(`${this.name} cannot be reset`);
    }
    get(vm, index) {
        assert.cond(index.length === 0, "CHARANUM cannot be indexed");
        return vm.characterList.length;
    }
    set(_vm, _value, _index) {
        throw new Error(`Cannot assign a value to ${this.name}`);
    }
    rangeSet(_vm, _value, _index, _range) {
        throw new Error(`Cannot assign a value to ${this.name}`);
    }
    length(depth) {
        switch (depth) {
            case 0: return 1;
            default: throw new Error(`${this.name} doesn't have a value at depth ${depth}`);
        }
    }
}
