import Statement from "./statement";
import type VM from "./vm";

export default class Thunk extends Statement {
	public statement: Statement[];
	public labelMap: Map<string, number>;

	// NOTE: `statement` argument is mixed array of statments and labels
	public constructor(statement: Array<Statement | string>) {
		super();
		this.statement = [];
		this.labelMap = new Map();

		for (let i = 0; i < statement.length; ++i) {
			const s = statement[i];
			if (typeof s === "string") {
				this.labelMap.set(s, this.statement.length);
			} else {
				this.statement.push(s);
			}
		}
	}

	public *run(vm: VM) {
		for (const statement of this.statement) {
			const result = yield* statement.run(vm);
			switch (result?.type) {
				case "begin": return result;
				case "break": return result;
				case "continue": return result;
				case "return": return result;
				case undefined: continue;
			}
		}
		return null;
	}
}
