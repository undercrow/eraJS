import Assign from "./statement/assign";
import Variable from "./statement/expr/variable";
import type Property from "./property";
import Order from "./property/order";
import Thunk from "./thunk";

export default class Fn {
	public name: string;
	public arg: Array<Assign | Variable>;
	public property: Property[];
	public thunk: Thunk;

	// NOTE: `statement` argument is mixed array of statments and labels
	public constructor(name: string, arg: Fn["arg"], property: Property[], thunk: Thunk) {
		this.name = name;
		this.arg = arg;
		this.thunk = thunk;
		this.property = property;
	}

	public isFirst(): boolean {
		return this.property.some((p) => p instanceof Order && p.order === "PRI");
	}

	public isLast(): boolean {
		return this.property.some((p) => p instanceof Order && p.order === "LATER");
	}
}
