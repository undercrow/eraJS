import type Expr from "../statement/expr";
import Value from "../value";
import type VM from "../vm";
export default class Dim {
    name: string;
    type: "number" | "string";
    size: Expr[];
    value?: Expr[];
    constructor(name: Dim["name"], type: Dim["type"], size: Dim["size"], value: Dim["value"]);
    apply(vm: VM, variableMap: Map<string, Value>): void;
}
