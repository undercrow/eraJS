import * as E from "../erb/expr";
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
		const dest = vm.getValue(this.dest.name);
		const index = this.dest.reduceIndex(vm);
		const partialIndex = index.slice(0, -1);
		const lastIndex = index[index.length - 1] ?? 0;

		if (dest.type === "number") {
			const valueList = U.sepBy0(",", E.expr).tryParse(this.value);
			for (let i = 0; i < valueList.length; ++i) {
				const value = valueList[i].reduce(vm);
				dest.set(vm, value, [...partialIndex, lastIndex + i]);
			}
		} else {
			if (this.value.length !== 0) {
				const rawList = U.sepBy0(",", U.charSeq0(",")).tryParse(this.value);
				const formList = rawList.map((raw) => E.form().tryParse(raw));
				for (let i = 0; i < formList.length; ++i) {
					const value = formList[i].reduce(vm);
					dest.set(vm, value, [...partialIndex, lastIndex + i]);
				}
			} else {
				dest.set(vm, "", index);
			}
		}

		return null;
	}
}
