import { assertNumber } from "../assert";
export default class IntChar0DValue {
    type = "number";
    name;
    static normalizeIndex(vm, index) {
        if (index.length === 0) {
            return [vm.getValue("TARGET").get(vm, [])];
        }
        else if (index.length === 1) {
            return index;
        }
        else if (index.length === 2 && index[1] === 0) {
            return index.slice(0, -1);
        }
        else {
            throw new Error("0D character variable must be indexed by at most 1 value");
        }
    }
    constructor(name) {
        this.name = name;
    }
    get(vm, index) {
        const realIndex = IntChar0DValue.normalizeIndex(vm, index);
        if (vm.characterList.length <= realIndex[0]) {
            throw new Error(`Character #${realIndex[0]} does not exist`);
        }
        const cell = vm.characterList[realIndex[0]].getValue(this.name);
        return cell.get(vm, realIndex.slice(1));
    }
    set(vm, value, index) {
        const realIndex = IntChar0DValue.normalizeIndex(vm, index);
        assertNumber(value, "Cannot assign a string to a numeric variable");
        if (vm.characterList.length <= realIndex[0]) {
            throw new Error(`Character #${realIndex[0]} does not exist`);
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
