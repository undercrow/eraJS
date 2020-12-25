import * as U from "../../erb/util";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class LoadGlobal extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	public *run(vm: VM) {
		try {
			const rawGlobal = vm.storage.get("GLOBAL");
			if (rawGlobal == null) {
				throw new Error("GLOBAL does not exist on the storage");
			}
			const global = JSON.parse(rawGlobal);
			const globalCell = vm.getValue("GLOBAL")!;
			if (!Array.isArray(global)) {
				throw new Error("Saved GLOBAL is not in valid format");
			}

			for (let i = 0; i < globalCell.length(0); ++i) {
				const value = global[i];
				if (typeof value !== "number" && typeof value !== "string") {
					throw new Error(`${i}th element of saved GLOBAL has invalid value`);
				}
				globalCell.set(vm, value, [i]);
			}

			const rawGlobalS = vm.storage.get("GLOBALS");
			if (rawGlobalS == null) {
				throw new Error("GLOBALS does not exist on the storage");
			}
			const globalS = JSON.parse(rawGlobalS);
			const globalSCell = vm.getValue("GLOBALS")!;
			if (!Array.isArray(globalS)) {
				throw new Error("Saved GLOBALS is not in valid format");
			}

			for (let i = 0; i < globalSCell.length(0); ++i) {
				const value = globalS[i];
				if (typeof value !== "number" && typeof value !== "string") {
					throw new Error(`${i}th element of saved GLOBALS has invalid value`);
				}
				globalSCell.set(vm, value, [i]);
			}
			vm.getValue("RESULT").set(vm, 1, [0]);
		} catch (e) {
			// eslint-disable-next-line no-console
			console.log("Error found in LOADGLOBAL: ", (e as Error).message);
			vm.getValue("RESULT").set(vm, 0, [0]);
		}

		return null;
	}
}
