import type VM from "../../vm";
import Statement from "../index";
export default class UpCheck extends Statement {
    constructor(arg: string);
    run(vm: VM): Generator<import("../index").Output, null, string>;
}
