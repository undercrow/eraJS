import type Statement from "./statement";

export default class Fn {
	public name: string;
	public statement: Statement[];
	public labelMap: Map<string, number>;

	// NOTE: `statement` argument is mixed array of statments and labels
	public constructor(name: string, statement: Array<Statement | string>) {
		this.name = name;
		this.statement = [];
		this.labelMap = new Map();
		for (let i = 0; i < statement.length; ++i) {
			const s = statement[i];
			if (typeof s === "string") {
				this.labelMap.set(s, i - this.labelMap.size);
			} else {
				this.statement.push(s);
			}
		}
	}
}
