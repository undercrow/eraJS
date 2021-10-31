import * as assert from "../assert";
import * as E from "../error";
export default class IntChar0DValue {
    type = "number";
    name;
    value;
    static normalizeIndex(vm, name, index) {
        if (index.length === 0) {
            return [Number(vm.getValue("TARGET").get(vm, []))];
        }
        else if (index.length === 1) {
            return index;
        }
        else if (index.length === 2 && index[1] === 0) {
            return index.slice(0, -1);
        }
        else {
            throw E.invalidIndex("0D character", name, index);
        }
    }
    constructor(name) {
        this.name = name;
    }
    reset() {
        throw E.internal(`0D character variable ${this.name} cannot be reset`);
    }
    get(vm, index) {
        const realIndex = IntChar0DValue.normalizeIndex(vm, this.name, index);
        if (vm.characterList.length <= realIndex[0]) {
            throw E.notFound("Character", `#${realIndex[0]}`);
        }
        const cell = vm.characterList[realIndex[0]].getValue(this.name);
        return cell.get(vm, realIndex.slice(1));
    }
    set(vm, value, index) {
        const realIndex = IntChar0DValue.normalizeIndex(vm, this.name, index);
        assert.bigint(value, "Cannot assign a string to a numeric variable");
        if (vm.characterList.length <= realIndex[0]) {
            throw E.notFound("Character", `#${realIndex[0]}`);
        }
        const cell = vm.characterList[realIndex[0]].getValue(this.name);
        cell.set(vm, value, realIndex.slice(1));
    }
    rangeSet(vm, value, index, _range) {
        this.set(vm, value, index);
    }
    length(depth) {
        switch (depth) {
            case 0: return 1;
            case 1: return 1;
            default:
                throw new Error(`1D character variable doesn't have a value at depth ${depth}`);
        }
    }
}
