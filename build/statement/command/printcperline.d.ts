import VM from "../../vm";
import Statement from "../index";
export default class PrintCPerLine extends Statement {
    constructor(arg: string);
    run(vm: VM): Generator<never, null, unknown>;
}
