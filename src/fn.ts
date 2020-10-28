import Statement from "./statement";

export type Extra =
	| {type: "label", name: string}
	| {type: "variable", name: string, size: number[]}
	| {type: "first"};

export default class Fn {
	public name: string;
	public order?: "first" | "last";
	public statement: Statement[];
	public labelMap: Map<string, number>;
	public variableMap: Map<string, number[]>;

	// NOTE: `statement` argument is mixed array of statments and labels
	public constructor(name: string, statement: Array<Statement | Extra>) {
		this.name = name;
		this.statement = [];
		this.labelMap = new Map();
		this.variableMap = new Map();

		for (let i = 0; i < statement.length; ++i) {
			const s = statement[i];
			if (s instanceof Statement) {
				this.statement.push(s);
			} else {
				switch (s.type) {
					case "label": {
						this.labelMap.set(s.name, this.statement.length);
						break;
					}
					case "first": {
						this.order = "first";
						break;
					}
					case "variable": {
						this.variableMap.set(s.name, s.size);
						break;
					}
				}
			}
		}
	}
}
