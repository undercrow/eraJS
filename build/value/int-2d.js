import * as assert from "../assert";
import * as EM from "../error";
export default class Int2DValue {
    type = "number";
    name;
    value;
    static normalizeIndex(name, index) {
        if (index.length === 0) {
            return [0, 0];
        }
        else if (index.length === 1) {
            return [index[0], 0];
        }
        else if (index.length === 2) {
            return index;
        }
        else if (index.length === 3 && index[2] === 0) {
            return index.slice(0, -1);
        }
        else {
            throw EM.invalidIndex("2D", name, index);
        }
    }
    constructor(name, size0, size1) {
        this.name = name;
        this.value = new Array(size0).fill(0).map(() => new Array(size1).fill(0));
    }
    reset(value) {
        for (let i = 0; i < this.value.length; ++i) {
            for (let j = 0; j < this.value[i].length; ++j) {
                this.value[i][j] = 0;
            }
        }
        for (let i = 0; i < value.length; ++i) {
            for (let j = 0; j < value[i].length; ++j) {
                this.value[i][j] = value[i][j];
            }
        }
        return this;
    }
    get(_vm, index) {
        const realIndex = Int2DValue.normalizeIndex(this.name, index);
        return this.value[realIndex[0]][realIndex[1]];
    }
    set(_vm, value, index) {
        const realIndex = Int2DValue.normalizeIndex(this.name, index);
        assert.number(value, "Cannot assign a string to a numeric variable");
        this.value[realIndex[0]][realIndex[1]] = value;
    }
    // NOTE: index, range are ignored (Emuera emulation)
    rangeSet(_vm, value, _index, _range) {
        assert.number(value, "Cannot assign a string to a numeric variable");
        for (let i = 0; i < this.value.length; ++i) {
            for (let j = 0; j < this.value[i].length; ++j) {
                this.value[i][j] = value;
            }
        }
    }
    length(depth) {
        switch (depth) {
            case 0: return this.value.length;
            case 1: return this.value[0].length;
            case 2: return 1;
            default: throw new Error(`2D variable doesn't have a value at depth ${depth}`);
        }
    }
}
