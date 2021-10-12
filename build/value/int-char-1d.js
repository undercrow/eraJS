import * as assert from "../assert";
export default class IntChar1DValue {
    type = "number";
    name;
    size;
    static normalizeIndex(vm, index) {
        if (index.length === 0) {
            return [vm.getValue("TARGET").get(vm, []), 0];
        }
        else if (index.length === 1) {
            return [vm.getValue("TARGET").get(vm, []), index[0]];
        }
        else if (index.length === 2) {
            return index;
        }
        else if (index.length === 3 && index[2] === 0) {
            return index.slice(0, -1);
        }
        else {
            throw new Error("1D character variable must be indexed by at most 2 values");
        }
    }
    constructor(name, size) {
        this.name = name;
        this.size = size;
    }
    get(vm, index) {
        const realIndex = IntChar1DValue.normalizeIndex(vm, index);
        if (vm.characterList.length <= realIndex[0]) {
            throw new Error(`Character #${realIndex[0]} does not exist`);
        }
        const cell = vm.characterList[realIndex[0]].getValue(this.name);
        return cell.get(vm, realIndex.slice(1));
    }
    set(vm, value, index) {
        const realIndex = IntChar1DValue.normalizeIndex(vm, index);
        assert.number(value, "Cannot assign a string to a numeric variable");
        if (vm.characterList.length <= realIndex[0]) {
            throw new Error(`Character #${realIndex[0]} does not exist`);
        }
        const cell = vm.characterList[realIndex[0]].getValue(this.name);
        cell.set(vm, value, realIndex.slice(1));
    }
    rangeSet(vm, value, index, range) {
        const realIndex = IntChar1DValue.normalizeIndex(vm, [...index, 0]);
        assert.number(value, "Cannot assign a string to a numeric variable");
        if (vm.characterList.length <= realIndex[0]) {
            throw new Error(`Character #${realIndex[0]} does not exist`);
        }
        const cell = vm.characterList[realIndex[0]].getValue(this.name);
        cell.rangeSet(vm, value, realIndex.slice(1), range);
    }
    length(depth) {
        switch (depth) {
            case 0: return this.size;
            case 1: return this.size;
            case 2: return 1;
            default:
                throw new Error(`1D character variable doesn't have a value at depth ${depth}`);
        }
    }
}
