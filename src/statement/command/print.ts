import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";

// type OutType = "K" | "D" | null;
type Action = "newline" | "wait" | null;

export default class Print extends Statement {
	public static *print(vm: VM, text: string): ReturnType<Statement["run"]> {
		if (text.length === 0) {
			return null;
		}

		const lines = text.split("\n");
		for (let i = 0; i < lines.length - 1; ++i) {
			yield <const>{type: "string", text: lines[i]};
			yield <const>{type: "string", text: "\n"};
		}
		yield <const>{type: "string", text: lines[lines.length - 1]};

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
				yield* Print.print(vm, "\n");
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
	public value: Lazy<string>;

	public constructor(instruction: string, raw: string) {
		super();
		this.postfix = instruction.replace(/^PRINT/, "");
		this.value = new Lazy(raw, U.arg1R0(U.charSeq()).map((str) => str ?? ""));
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		yield* Print.print(vm, this.value.get());
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
