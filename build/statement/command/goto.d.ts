import type VM from "../../vm";
import Statement from "../index";
export default class Goto extends Statement {
    static parse(raw: string): Goto;
    target: string;
    constructor(target: string);
    run(vm: VM): Generator<never, {
        readonly type: "goto";
        readonly label: string;
    }, unknown>;
}
