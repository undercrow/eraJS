import Statement from "../index";
export default class Assign extends Statement {
    dest;
    value;
    constructor(dest, value) {
        super();
        this.dest = dest;
        this.value = value;
    }
    *run(vm) {
        const dest = this.dest.getCell(vm);
        const index = this.dest.reduceIndex(vm);
        const partialIndex = index.slice(0, -1);
        const lastIndex = index[index.length - 1] ?? 0;
        if (this.value.length !== 0) {
            for (let i = 0; i < this.value.length; ++i) {
                const value = this.value[i].reduce(vm);
                dest.set(vm, value, [...partialIndex, lastIndex + i]);
            }
        }
        else {
            dest.set(vm, "", index);
        }
        return null;
    }
}
