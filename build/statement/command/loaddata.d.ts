import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement, { EraGenerator } from "../index";
export default class LoadData extends Statement {
    arg: Lazy<Expr>;
    constructor(raw: Slice);
    run(vm: VM): EraGenerator;
}
