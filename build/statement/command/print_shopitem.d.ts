import type VM from "../../vm";
import Statement from "../index";
export default class PrintShopItem extends Statement {
    constructor(arg: string);
    run(vm: VM): Generator<import("../index").Output, null, string | null>;
}
