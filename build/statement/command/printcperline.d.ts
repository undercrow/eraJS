import Slice from "../../slice";
import VM from "../../vm";
import Statement from "../index";
export default class PrintCPerLine extends Statement {
    constructor(raw: Slice);
    run(vm: VM): Generator<never, null, unknown>;
}
