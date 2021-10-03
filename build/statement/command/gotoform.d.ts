import type VM from "../../vm";
import Form from "../expr/form";
import Statement from "../index";
export default class GotoForm extends Statement {
    static parse(raw: string): GotoForm;
    target: Form;
    constructor(target: Form);
    run(vm: VM): Generator<never, {
        readonly type: "goto";
        readonly label: string;
    }, unknown>;
}
