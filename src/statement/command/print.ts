import * as U from "../../erb/util";
import Lazy from "../../lazy";
import type VM from "../../vm";
import Statement from "../index";

// type OutType = "K" | "D" | null;
type Action = "newline" | "wait" | null;

const PARSER = U.arg1R0(U.charSeq()).map((str) => str ?? "");
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
				yield* vm.newline();
				break;
			}
			case "wait": {
				yield* vm.newline();
				yield <const>{type: "wait", force: false};
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
		this.value = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		if (vm.skipDisp) {
			return null;
		}

		yield* vm.print(this.value.get());
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
