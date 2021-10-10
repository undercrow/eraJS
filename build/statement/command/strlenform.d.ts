import Lazy from "../../lazy";
import type VM from "../../vm";
import type Form from "../expr/form";
import Statement from "../index";
export default class StrLenForm extends Statement {
    value: Lazy<Form>;
    constructor(arg: string);
    run(vm: VM): Generator<never, null, unknown>;
}
