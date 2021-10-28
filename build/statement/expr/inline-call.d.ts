import type VM from "../../vm";
import type Expr from "../expr";
export default class InlineCall implements Expr {
    name: string;
    arg: Expr[];
    constructor(name: string, arg: Expr[]);
    reduce(vm: VM): Promise<string | number>;
}
