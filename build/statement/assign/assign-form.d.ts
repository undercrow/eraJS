import type VM from "../../vm";
import type Form from "../expr/form";
import Variable from "../expr/variable";
import Statement from "../index";
export default class Assign extends Statement {
    dest: Variable;
    value: Form[];
    constructor(dest: Variable, value: Form[]);
    run(vm: VM): Generator<never, null, unknown>;
}
