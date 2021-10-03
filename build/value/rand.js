import { assert } from "../assert";
export default class RandValue {
    type = "number";
    name;
    constructor(name) {
        this.name = name;
    }
    get(vm, index) {
        assert(index.length === 1, "RAND must be indexed by 1 value");
        return Math.floor(vm.random.next() % index[0]);
    }
    set(_vm, _value, _index) {
        throw new Error("Cannot assign a value to RAND");
    }
    rangeSet(_vm, _value, _index, _range) {
        throw new Error("Cannot assign a value to RAND");
    }
    length(_depth) {
        throw new Error("Cannot get the length of RAND");
    }
}
