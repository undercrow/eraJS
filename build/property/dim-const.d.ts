import type Expr from "../statement/expr";
import Value from "../value";
import type VM from "../vm";
export default class DimConst {
    name: string;
    type: "number" | "string";
    size: Expr[];
    value?: Expr[];
    constructor(name: DimConst["name"], type: DimConst["type"], size: DimConst["size"], value: DimConst["value"]);
    apply(vm: VM, variableMap: Map<string, Value>): void;
}
