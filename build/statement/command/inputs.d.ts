import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement, { EraGenerator } from "../index";
export default class InputS extends Statement {
    arg: Lazy<string | undefined>;
    constructor(raw: Slice);
    run(vm: VM): EraGenerator;
}
