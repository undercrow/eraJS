import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";
export default class Goto extends Statement {
    arg: Lazy<string>;
    constructor(raw: string);
    run(vm: VM): Generator<never, {
        readonly type: "goto";
        readonly label: string;
    }, unknown>;
}
