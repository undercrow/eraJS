import Statement from "./statement";
import type VM from "./vm";
export default class Thunk extends Statement {
    statement: Statement[];
    labelMap: Map<string, number>;
    constructor(statement: Array<Statement | string>);
    run(vm: VM, label?: string): ReturnType<Statement["run"]>;
}
