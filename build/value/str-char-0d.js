import * as assert from "../assert";
import * as EM from "../error";
export default class StrChar0DValue {
    type = "string";
    name;
    static normalizeIndex(vm, name, index) {
        if (index.length === 0) {
            return [vm.getValue("TARGET").get(vm, [])];
        }
        else if (index.length === 1) {
            return index;
        }
        else if (index.length === 2 && index[0] === 0) {
            return index.slice(0, -1);
        }
        else {
            throw EM.invalidIndex("0D character", name, index);
        }
    }
    constructor(name) {
        this.name = name;
    }
    get(vm, index) {
        const realIndex = StrChar0DValue.normalizeIndex(vm, this.name, index);
        if (vm.characterList.length <= realIndex[0]) {
            throw EM.notFound("Character", `#${realIndex[0]}`);
        }
        const cell = vm.characterList[realIndex[0]].getValue(this.name);
        return cell.get(vm, realIndex.slice(1));
    }
    set(vm, value, index) {
        const realIndex = StrChar0DValue.normalizeIndex(vm, this.name, index);
        assert.string(value, "Cannot assign a number to a string variable");
        if (vm.characterList.length <= realIndex[0]) {
            throw EM.notFound("Character", `#${realIndex[0]}`);
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
