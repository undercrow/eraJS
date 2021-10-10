import Lazy from "../../lazy";
import type VM from "../../vm";
import type Form from "../expr/form";
import Statement from "../index";
export default class DrawLineForm extends Statement {
    arg: Lazy<Form>;
    constructor(arg: string);
    run(vm: VM): Generator<{
        readonly type: "line";
        readonly value: string;
    }, null, unknown>;
}
