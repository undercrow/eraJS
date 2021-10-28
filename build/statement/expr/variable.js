import * as assert from "../../assert";
export default class Variable {
    name;
    index;
    scope;
    constructor(name, index, scope) {
        this.name = name.toUpperCase();
        this.index = index;
        this.scope = scope;
    }
    getCell(vm) {
        return vm.getValue(this.name, this.scope);
    }
    async reduce(vm) {
        if (vm.macroMap.has(this.name)) {
            if (this.index.length !== 0) {
                throw new Error("Macro cannot be indexed");
            }
            const expr = vm.macroMap.get(this.name)?.expr;
            if (expr == null) {
                throw new Error("Empty macro cannot be referenced");
            }
            return expr.reduce(vm);
        }
        else {
            return this.getCell(vm).get(vm, await this.reduceIndex(vm));
        }
    }
    async reduceIndex(vm) {
        if (this.index.length !== 0) {
            const result = [];
            for (const i of this.index) {
                const value = await i.reduce(vm);
                assert.number(value, "Index of variable should be an integer");
                result.push(value);
            }
            return result;
        }
        else {
            return [];
        }
    }
}
