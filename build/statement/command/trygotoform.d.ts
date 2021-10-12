import type VM from "../../vm";
import type Form from "../expr/form";
import Statement from "../index";
export default class TryGotoForm extends Statement {
    static parse(raw: string): TryGotoForm;
    target: Form;
    constructor(target: Form);
    run(vm: VM): Generator<never, {
        readonly type: "goto";
        readonly label: string;
    } | null, unknown>;
}
