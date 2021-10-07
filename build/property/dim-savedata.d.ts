import type Expr from "../statement/expr";
import Value from "../value";
import type VM from "../vm";
export default class DimSavedata {
    name: string;
    type: "number" | "string";
    size: Expr[];
    value?: Expr[];
    constructor(name: DimSavedata["name"], type: DimSavedata["type"], size: DimSavedata["size"], value: DimSavedata["value"]);
    apply(vm: VM, variableMap: Map<string, Value>): void;
}
