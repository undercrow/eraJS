import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Form from "../expr/form";
import Statement from "../index";
export default class StrLenForm extends Statement {
    arg: Lazy<Form>;
    constructor(raw: Slice);
    run(vm: VM): AsyncGenerator<never, null, unknown>;
}
