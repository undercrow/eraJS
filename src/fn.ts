import Assign from "./statement/assign";
import Variable from "./statement/expr/variable";
import Thunk from "./thunk";

export type Property =
	| {type: "variable-int", name: string, size: number[]}
	| {type: "variable-string", name: string, size: number[]}
	| {type: "localsize", size: number}
	| {type: "localssize", size: number}
	| {type: "first"};

export default class Fn {
	public name: string;
	public arg: Array<Assign | Variable>;
	public order?: "first" | "last";
	public localSize?: number;
	public localSSize?: number;
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
				case "localsize": {
					this.localSize = p.size;
					break;
				}
				case "localssize": {
					this.localSSize = p.size;
					break;
				}
			}
		}
	}
}
