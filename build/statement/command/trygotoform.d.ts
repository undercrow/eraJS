import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Form from "../expr/form";
import Statement from "../index";
export default class TryGotoForm extends Statement {
    static parse(arg: Slice): TryGotoForm;
    arg: Lazy<Form>;
    constructor(raw: Slice);
    run(vm: VM): Generator<never, {
        readonly type: "goto";
        readonly label: string;
    } | null, unknown>;
}
