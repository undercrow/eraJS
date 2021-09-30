import * as U from "../../erb/util";
import type VM from "../../vm";
import Statement from "../index";
import Print from "./print";

const PARSER = U.arg0R0();
export default class CUpCheck extends Statement {
	public constructor(arg: string) {
		super();
		PARSER.tryParse(arg);
	}

	public *run(vm: VM) {
		const target = vm.getValue("TARGET").get(vm, [0]) as number;
		const length = Math.min(
			vm.getValue("PALAM").length(1),
			vm.getValue("CUP").length(1),
			vm.getValue("CDOWN").length(1),
		);

		for (let i = 0; i < length; ++i) {
			const up = vm.getValue("CUP").get(vm, [target, i]) as number;
			const down = vm.getValue("CDOWN").get(vm, [target, i]) as number;
			const palam = vm.getValue("PALAM").get(vm, [target, i]) as number;

			if (up <= 0 && down <= 0) {
				continue;
			}
			const result = palam + up - down;
			vm.getValue("PALAM").set(vm, result, [target, i]);
			vm.getValue("CUP").set(vm, 0, [target, i]);
			vm.getValue("CDOWN").set(vm, 0, [target, i]);

			if (!vm.skipDisp) {
				const name = vm.code.data.palam.get(i)!;
				let text = `${name} ${palam}`;
				if (up > 0) {
					text += `+${up}`;
				}
				if (down > 0) {
					text += `-${down}`;
				}
				text += `=${result}`;

				yield* Print.print(vm, text);
				yield* Print.print(vm, "\n");
			}
		}

		return null;
	}
}