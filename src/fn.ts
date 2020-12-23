import type Property from "./property";
import Order from "./property/order";
import type {Output, Result} from "./statement";
import Variable from "./statement/expr/variable";
import Thunk from "./thunk";
import type VM from "./vm";

export default class Fn {
	public static START_OF_FN = "@@START";

	public name: string;
	public arg: Array<[Variable, string | number | null]>;
	public property: Property[];
	public thunk: Thunk;

	// NOTE: `statement` argument is mixed array of statments and labels
	public constructor(name: string, arg: Fn["arg"], property: Property[], thunk: Thunk) {
		this.name = name;
		this.arg = arg;
		this.thunk = thunk;
		this.property = property;

		this.thunk.labelMap.set(Fn.START_OF_FN, 0);
	}

	public isFirst(): boolean {
		return this.property.some((p) => p instanceof Order && p.order === "PRI");
	}

	public isLast(): boolean {
		return this.property.some((p) => p instanceof Order && p.order === "LATER");
	}

	public *run(vm: VM, arg: Array<string | number>): Generator<Output, Result | null, string> {
		vm.pushContext(this);

		for (let i = 0; i < this.arg.length; ++i) {
			const [argDest, argDef] = this.arg[i];
			const dest = vm.getValue(argDest.name);
			const index = argDest.reduceIndex(vm);
			if (dest.type === "number") {
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				dest.set(vm, arg[i] ?? argDef ?? 0, index);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				dest.set(vm, arg[i] ?? argDef ?? "", index);
			}
		}

		const result = yield* this.thunk.run(vm);
		vm.popContext();

		return result;
	}
}
