import type Expr from "../statement/expr";
import type VM from "../vm";
export default class DimDynamic {
    name: string;
    type: "number" | "string";
    size: Expr[];
    value?: Expr[];
    constructor(name: DimDynamic["name"], type: DimDynamic["type"], size: DimDynamic["size"], value: DimDynamic["value"]);
    apply(vm: VM): void;
}
