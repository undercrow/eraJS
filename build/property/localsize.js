import Int1DValue from "../value/int-1d";
export default class LocalSize {
    size;
    constructor(size) {
        this.size = size;
    }
    apply(vm, fn) {
        vm.staticMap.get(fn).set("LOCAL", new Int1DValue("LOCAL", [this.size]));
    }
}
