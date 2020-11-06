import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

// type OutType = "K" | "D" | null;
type Action = "newline" | "wait" | null;

// TODO: Buttonize some texts
export default class Print extends Statement {
	public static *runPostfix(vm: VM, value: string): ReturnType<Statement["run"]> {
		// let out: OutType = null;
		let action: Action = null;

		switch (value) {
			case "": action = null; break;
			case "L": action = "newline"; break;
			case "W": action = "wait"; break;
			case "K": action = null; break;
			case "KL": action = "newline"; break;
			case "KW": action = "wait"; break;
			case "D": action = null; break;
			case "DL": action = "newline"; break;
			case "DW": action = "wait"; break;
			default: throw new Error(`${value} is not a valid print postfix`);
		}

		// TODO: Apply outType
		switch (action) {
			case "newline": {
				yield <const>{type: "string", text: "\n"};
				const lineCount = vm.getValue("LINECOUNT") as number;
				vm.setValue(lineCount + 1, "LINECOUNT");
				break;
			}
			case "wait": {
				yield <const>{type: "wait"};
				break;
			}
			case null: {
				// Do nothing
				break;
			}
		}

		return null;
	}

	public postfix: string;
	public value: Expr;

	public constructor(instruction: string, value: Expr) {
		super();
		this.postfix = instruction.replace(/^PRINT/, "");
		this.value = value;
	}

	public *run(vm: VM) {
		const value = this.value.reduce(vm);
		yield <const>{
			type: "string",
			text: typeof value === "string" ? value : value.toString(),
		};

		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
