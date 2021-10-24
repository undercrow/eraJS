import Statement, { EraGenerator } from "./statement";
import type VM from "./vm";
export default class Thunk {
    statement: Statement[];
    labelMap: Map<string, number>;
    constructor(statement: Array<Statement | string>);
    run(vm: VM, label?: string): EraGenerator;
}
