import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement, { EraGenerator } from "../index";
export default class OneInput extends Statement {
    arg: Lazy<number | undefined>;
    constructor(raw: Slice);
    run(vm: VM): EraGenerator;
}
