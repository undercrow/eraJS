import type Expr from "../statement/expr";
export default class Define {
    name: string;
    expr?: Expr;
    constructor(name: Define["name"], expr?: Define["expr"]);
}
