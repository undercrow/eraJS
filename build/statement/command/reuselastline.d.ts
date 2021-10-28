import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Form from "../expr/form";
import Statement, { EraGenerator } from "../index";
export default class ReuseLastLine extends Statement {
    arg: Lazy<Form | undefined>;
    constructor(raw: Slice);
    run(vm: VM): EraGenerator;
}
