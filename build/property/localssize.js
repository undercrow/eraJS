import Str1DValue from "../value/str-1d";
export default class LocalSSize {
    size;
    constructor(size) {
        this.size = size;
    }
    apply(vm, fn) {
        vm.staticMap.get(fn).set("LOCALS", new Str1DValue("LOCALS", [this.size]));
    }
}
