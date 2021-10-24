import type Expr from "../statement/expr";
import Value from "../value";
import type VM from "../vm";
export default class Dim {
    name: string;
    type: "number" | "string";
    prefix: Set<string>;
    size: Expr[];
    value?: Expr[];
    constructor(name: string, type: Dim["type"], prefix: string[], size: Expr[], value?: Expr[]);
    isDynamic(): boolean;
    isGlobal(): boolean;
    isSave(): boolean;
    isChar(): boolean;
    build(vm: VM): Value<any>;
}
