import type VM from "../../vm";
import type Expr from "./index";
export default class Const implements Expr {
    value: number | string;
    constructor(value: Const["value"]);
    reduce(_vm: VM): Promise<number | string>;
}
