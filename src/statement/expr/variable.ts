import * as assert from "../../assert";
import Value from "../../value";
import type VM from "../../vm";
import type Expr from "./index";

// TODO: index
export default class Variable implements Expr {
	public name: string;
	public index: Expr[];
	public scope?: string;

	public constructor(name: string, index: Expr[], scope?: string) {
		this.name = name.toUpperCase();
		this.index = index;
		this.scope = scope;
	}

	public getCell(vm: VM): Value {
		return vm.getValue(this.name, this.scope);
	}

	public reduce(vm: VM): string | number {
		if (vm.macroMap.has(this.name)) {
			if (this.index.length !== 0) {
				throw new Error("Macro cannot be indexed");
			}

			const expr = vm.macroMap.get(this.name)?.expr;
			if (expr == null) {
				throw new Error("Empty macro cannot be referenced");
			}

			return expr.reduce(vm);
		} else {
			return this.getCell(vm).get(vm, this.reduceIndex(vm));
		}
	}

	public reduceIndex(vm: VM): number[] {
		if (this.index.length !== 0) {
			const index = this.index.map((i) => i.reduce(vm));
			index.forEach((i) => assert.number(i, "Index of variable should be an integer"));

			return index as number[];
		} else {
			return [];
		}
	}
}
