import Thunk from "./thunk";

export type Property =
	| {type: "variable", name: string, size: number[]}
	| {type: "first"};

export default class Fn {
	public name: string;
	public order?: "first" | "last";
	public thunk: Thunk;
	public labelMap: Map<string, number>;
	public variableMap: Map<string, number[]>;

	// NOTE: `statement` argument is mixed array of statments and labels
	public constructor(name: string, property: Property[], thunk: Thunk) {
		this.name = name;
		this.thunk = thunk;
		this.labelMap = new Map();
		this.variableMap = new Map();

		for (const p of property) {
			switch (p.type) {
				case "first": {
					this.order = "first";
					break;
				}
				case "variable": {
					this.variableMap.set(p.name, p.size);
					break;
				}
			}
		}
	}
}
