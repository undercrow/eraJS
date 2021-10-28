import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
export default class Goto extends Statement {
    static exec(vm: VM, target: string): Generator<never, {
        readonly type: "goto";
        readonly label: string;
    }, unknown>;
    arg: Lazy<string>;
    constructor(raw: Slice);
    run(vm: VM): AsyncGenerator<never, {
        readonly type: "goto";
        readonly label: string;
    }, unknown>;
}
