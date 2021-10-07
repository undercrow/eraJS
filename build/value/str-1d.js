import { assertString } from "../assert";
export default class Str1DValue {
    type = "string";
    name;
    value;
    static normalizeIndex(index) {
        if (index.length === 0) {
            return [0];
        }
        else if (index.length === 1) {
            return index;
        }
        else if (index.length === 2 && index[1] === 0) {
            return index.slice(0, -1);
        }
        else {
            throw new Error("1D variable must be indexed by at most 1 value");
        }
    }
    constructor(name, size0) {
        this.name = name;
        this.value = new Array(size0).fill("");
    }
    reset(value) {
        for (let i = 0; i < this.value.length; ++i) {
            this.value[i] = "";
        }
        if (value instanceof Map) {
            for (const [i, val] of value) {
                this.value[i] = val;
            }
        }
        else {
            for (let i = 0; i < value.length; ++i) {
                this.value[i] = value[i];
            }
        }
        return this;
    }
    get(_vm, index) {
        const realIndex = Str1DValue.normalizeIndex(index);
        return this.value[realIndex[0]];
    }
    set(_vm, value, index) {
        const realIndex = Str1DValue.normalizeIndex(index);
        assertString(value, "Cannot assign a number to a string variable");
        this.value[realIndex[0]] = value;
    }
    // NOTE: index is ignored (Emuera emulation)
    rangeSet(_vm, value, _index, range) {
        assertString(value, "Cannot assign a number to a string variable");
        for (let i = range[0]; i < range[1]; ++i) {
            this.value[i] = value;
        }
    }
    length(depth) {
        switch (depth) {
            case 0: return this.value.length;
            case 1: return 1;
            default: throw new Error(`1D variable doesn't have a value at depth ${depth}`);
        }
    }
}
