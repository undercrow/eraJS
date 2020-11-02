import {assertNumber} from "../assert";
import expr from "../erb/expr";
import * as U from "../erb/util";
import type VM from "../vm";
import Variable from "./expr/variable";
import Statement from "./index";

export default class Assign extends Statement {
	public dest: Variable;
	public value: string;

	public constructor(dest: Variable, value: string) {
		super();
		this.dest = dest;
		this.value = value.trim();
	}

	public *run(vm: VM) {
		const type = vm.typeof(this.dest.name);
		const index = this.dest.reduceIndex(vm);
		const partialIndex = index.slice(0, -1);
		const lastIndex = index[index.length - 1] ?? 0;

		if (type === "number") {
			const valueList = U.sepBy(",", expr.Expr).tryParse(this.value);
			for (let i = 0; i < valueList.length; ++i) {
				const value = valueList[i].reduce(vm);
				assertNumber(value, "Cannot assign a string to an integer variable");
				vm.setValue(value, this.dest.name, ...partialIndex, lastIndex + i);
			}
		} else {
			if (this.value.length !== 0) {
				const rawList = U.sepBy(",", U.charSeq0(",")).tryParse(this.value);
				const formList = rawList.map((raw) => expr.Form.tryParse(raw));
				for (let i = 0; i < formList.length; ++i) {
					const value = formList[i].reduce(vm);
					vm.setValue(value, this.dest.name, ...partialIndex, lastIndex + i);
				}
			} else {
				vm.setValue("", this.dest.name, ...index);
			}
		}

		return null;
	}
}
