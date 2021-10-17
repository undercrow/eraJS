import * as assert from "../assert";
import * as EM from "../error";
export default class Int0DValue {
    type = "number";
    name;
    value;
    static normalizeIndex(name, index) {
        if (index.length === 0) {
            return [];
        }
        else if (index.length === 1 && index[0] === 0) {
            return [];
        }
        else {
            throw EM.invalidIndex("0D", name, index);
        }
    }
    constructor(name) {
        this.name = name;
        this.value = 0;
    }
    reset(value) {
        this.value = value;
        return this;
    }
    get(_vm, index) {
        Int0DValue.normalizeIndex(this.name, index);
        return this.value;
    }
    set(_vm, value, index) {
        Int0DValue.normalizeIndex(this.name, index);
        assert.number(value, "Cannot assign a string to a numeric variable");
        this.value = value;
    }
    // NOTE: index is ignored (Emuera emulation)
    rangeSet(_vm, value, _index, _range) {
        assert.number(value, "Cannot assign a string to a numeric variable");
        this.value = value;
    }
    length(depth) {
        switch (depth) {
            case 0: return 1;
            default: throw new Error(`0D variable doesn't have a value at depth ${depth}`);
        }
    }
}
