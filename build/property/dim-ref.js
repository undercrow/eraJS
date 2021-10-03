export default class DimRef {
    name;
    constructor(name) {
        this.name = name;
    }
    apply(vm) {
        const context = vm.context();
        context.refMap.set(this.name, "");
    }
}
