import * as C from "../../parser/const";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement, {EraGenerator} from "../index";

// type OutType = "K" | "D" | null;
type Action = "newline" | "wait" | null;

const PARSER = U.arg1R0(C.charSeq()).map((str) => str ?? "");
export default class Print extends Statement {
	public static *runPostfix(vm: VM, value: string): EraGenerator<void> {
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
				yield* vm.queue.newline();
				break;
			}
			case "wait": {
				yield* vm.queue.newline();
				yield* vm.queue.wait(false);
				break;
			}
			case null: {
				// Do nothing
				break;
			}
		}
	}

	public postfix: string;
	public value: Lazy<string>;

	public constructor(instruction: string, raw: Slice) {
		super(raw);

		this.postfix = instruction.replace(/^PRINT/, "");
		this.value = new Lazy(raw, PARSER);
	}

	public *run(vm: VM) {
		if (vm.queue.skipDisp) {
			return null;
		}

		yield* vm.queue.print(this.value.get());
		yield* Print.runPostfix(vm, this.postfix);

		return null;
	}
}
