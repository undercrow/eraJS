import * as U from "../../erb/util";
import type VM from "../../vm";
import Statement from "../index";

export default class SaveGlobal extends Statement {
	public constructor(arg: string) {
		super();
		U.arg0R0().tryParse(arg);
	}

	public *run(vm: VM) {
		const global = [];
		const globalCell = vm.getValue("GLOBAL")!;
		for (let i = 0; i < globalCell.length(0); ++i) {
			global.push(globalCell.get(vm, [i]));
		}
		vm.storage.set("GLOBAL", JSON.stringify(global));

		const globalS = [];
		const globalSCell = vm.getValue("GLOBALS");
		for (let i = 0; i < globalSCell.length(0); ++i) {
			globalS.push(globalSCell.get(vm, [i]));
		}
		vm.storage.set("GLOBALS", JSON.stringify(globalS));

		return null;
	}
}
