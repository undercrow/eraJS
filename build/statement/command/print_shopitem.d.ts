import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";
export default class PrintShopItem extends Statement {
    constructor(raw: Slice);
    run(vm: VM): AsyncGenerator<import("../index").Output, null, string | null>;
}
