import * as assert from "./assert";
import Order from "./property/order";
import Variable from "./statement/expr/variable";
export default class Fn {
    static START_OF_FN = "@@START";
    name;
    arg;
    property;
    thunk;
    constructor(name, arg, property, thunk) {
        this.name = name;
        this.arg = arg;
        this.thunk = thunk;
        this.property = property;
        this.thunk.labelMap.set(Fn.START_OF_FN, 0);
    }
    isFirst() {
        return this.property.some((p) => p instanceof Order && p.order === "PRI");
    }
    isLast() {
        return this.property.some((p) => p instanceof Order && p.order === "LATER");
    }
    async *run(vm, arg) {
        await vm.pushContext(this);
        for (let i = 0; i < this.arg.length; ++i) {
            const [argDest, argDef] = this.arg[i];
            const dest = argDest.getCell(vm);
            const index = await argDest.reduceIndex(vm);
            if (dest.type === "number") {
                let value;
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (arg[i] != null) {
                    value = arg[i];
                }
                else if (argDef != null) {
                    if (argDef instanceof Variable) {
                        value = await argDef.reduce(vm);
                    }
                    else {
                        value = argDef;
                    }
                }
                else {
                    value = 0n;
                }
                assert.bigint(value, "Value for number argument must be a number");
                dest.set(vm, value, index);
            }
            else {
                let value;
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (arg[i] != null) {
                    value = arg[i];
                }
                else if (argDef != null) {
                    if (argDef instanceof Variable) {
                        value = await argDef.reduce(vm);
                    }
                    else {
                        value = argDef;
                    }
                }
                else {
                    value = "";
                }
                assert.string(value, "Value for string argument must be a string");
                dest.set(vm, value, index);
            }
        }
        const result = yield* this.thunk.run(vm);
        vm.popContext();
        return result;
    }
}
