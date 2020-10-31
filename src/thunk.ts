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

	public *run(vm: VM, index: number = 0): ReturnType<Statement["run"]> {
		for (let i = index; i < this.statement.length; ++i) {
			const statement = this.statement[i];
			const result = yield* statement.run(vm);
			switch (result?.type) {
				case "begin": return result;
				case "goto": {
					const label = result.label;
					if (this.labelMap.has(label)) {
						return yield* this.run(vm, this.labelMap.get(label));
					} else {
						return result;
					}
				}
				case "break": return result;
				case "continue": return result;
				case "return": return result;
				case undefined: continue;
			}
		}
		return null;
	}

	private hasLabel(label: string): boolean {
		if (this.labelMap.has(label)) {
			return true;
		}

		for (const statement of this.statement) {
			for (const subThunk of statement.getThunk()) {
				if (subThunk.hasLabel(label)) {
					return true;
				}
			}
		}

		return false;
	}

	private *tryGoto(vm: VM, label: string): ReturnType<Thunk["run"]> {
		if (this.labelMap.has(label)) {
			return yield* this.run(vm, this.labelMap.get(label));
		} else {
			for (const statement of this.statement) {
				for (const subThunk of statement.getThunk()) {
					const result = yield* subThunk.tryGoto(vm, label);
					if (!(result?.type === "goto" && result.label === label)) {
						return result;
					}
				}
			}
			return <const>{
				type: "goto",
				label,
			};
		}
	}
}
