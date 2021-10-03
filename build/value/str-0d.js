import { assertString } from "../assert";
export default class Str0DValue {
    type = "string";
    name;
    value;
    static normalizeIndex(index) {
        if (index.length === 0) {
            return [];
        }
        else if (index.length === 1 && index[0] === 0) {
            return [];
        }
        else {
            throw new Error("0D variable must be indexed by at most 0 value");
        }
    }
    constructor(name) {
        this.name = name;
        this.value = "";
    }
    reset(value) {
        this.value = value;
        return this;
    }
    get(_vm, index) {
        Str0DValue.normalizeIndex(index);
        return this.value;
    }
    set(_vm, value, index) {
        Str0DValue.normalizeIndex(index);
        assertString(value, "Cannot assign a number to a string variable");
        this.value = value;
    }
    // NOTE: index is ignored (Emuera emulation)
    rangeSet(_vm, value, _index, _range) {
        assertString(value, "Cannot assign a number to a string variable");
        this.value = value;
    }
    length(depth) {
        switch (depth) {
            case 0: return 1;
            default: throw new Error(`0D variable doesn't have a value at depth ${depth}`);
        }
    }
}
