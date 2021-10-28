import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Form from "../expr/form";
import Variable from "../expr/variable";
import Statement from "../index";
export default class AssignForm extends Statement {
    dest: Variable;
    arg: Lazy<Form[]>;
    constructor(dest: Variable, raw: Slice);
    run(vm: VM): AsyncGenerator<never, null, unknown>;
}
