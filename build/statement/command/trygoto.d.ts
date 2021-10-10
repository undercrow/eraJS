import type VM from "../../vm";
import Statement from "../index";
export default class TryGoto extends Statement {
    static parse(raw: string): TryGoto;
    target: string;
    constructor(target: string);
    run(vm: VM): Generator<never, {
        readonly type: "goto";
        readonly label: string;
    } | null, unknown>;
}
