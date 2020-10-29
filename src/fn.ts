import Variable from "./statement/expr/variable";
import Thunk from "./thunk";

export type Property =
	| {type: "variable-int", name: string, size: number[]}
	| {type: "variable-string", name: string, size: number[]}
	| {type: "first"};

export default class Fn {
	public name: string;
	public arg: Array<[Variable, string | number]>;
	public order?: "first" | "last";
	public thunk: Thunk;
	public labelMap: Map<string, number>;
	public intVariableMap: Map<string, number[]>;
	public stringVariableMap: Map<string, number[]>;

	// NOTE: `statement` argument is mixed array of statments and labels
	public constructor(name: string, arg: Fn["arg"], property: Property[], thunk: Thunk) {
		this.name = name;
		this.arg = arg;
		this.thunk = thunk;
		this.labelMap = new Map();
		this.intVariableMap = new Map();
		this.stringVariableMap = new Map();

		for (const p of property) {
			switch (p.type) {
				case "first": {
					this.order = "first";
					break;
				}
				case "variable-int": {
					this.intVariableMap.set(p.name, p.size);
					break;
				}
				case "variable-string": {
					this.stringVariableMap.set(p.name, p.size);
					break;
				}
			}
		}
	}
}
