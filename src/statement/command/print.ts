import type VM from "../../vm";
import Statement from "../index";

// type OutType = "K" | "D" | null;
type Action = "newline" | "wait" | null;

// TODO: Buttonize some texts
export default class Print extends Statement {
	public static *print(vm: VM, text: string): ReturnType<Statement["run"]> {
		yield <const>{
			type: "string",
			text,
		};

		const lineCount = vm.getValue("LINECOUNT").get(vm, []) as number;
		vm.getValue("LINECOUNT").set(vm, lineCount + (text.match(/\n/g) ?? []).length, []);

		return null;
	}

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
				yield* Print.print(vm, "\n");
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
	public value: string;

	public constructor(instruction: string, value: string) {
		super();
		this.postfix = instruction.replace(/^PRINT/, "");
		this.value = value;
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		yield* Print.print(vm, this.value);
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
