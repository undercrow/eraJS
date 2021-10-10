import type VM from "../../vm";
import Statement from "../index";
export default class FontRegular extends Statement {
    constructor(arg: string);
    run(vm: VM): Generator<never, null, unknown>;
}