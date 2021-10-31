import * as assert from "../../assert";
import * as E from "../../error";
export default class RandValue {
    type = "number";
    name = "RAND";
    value;
    constructor() {
        // Do nothing
    }
    reset() {
        throw E.internal(`${this.name} cannot be reset`);
    }
    get(vm, index) {
        assert.cond(index.length === 1, "RAND must be indexed by 1 value");
        return BigInt(Math.floor(vm.random.next() % index[0]));
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
