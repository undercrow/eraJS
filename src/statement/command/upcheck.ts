import * as U from "../../parser/util";
import Slice from "../../slice";
import type Int1DValue from "../../value/int-1d";
import type IntChar1DValue from "../../value/int-char-1d";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class UpCheck extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	public async *run(vm: VM) {
		const length = Math.min(
			vm.getValue("PALAM").length(1),
			vm.getValue("UP").length(0),
			vm.getValue("DOWN").length(0),
		);

		for (let i = 0; i < length; ++i) {
			const up = vm.getValue<Int1DValue>("UP").get(vm, [i]);
			const down = vm.getValue<Int1DValue>("DOWN").get(vm, [i]);
			const palam = vm.getValue<IntChar1DValue>("PALAM").get(vm, [i]);

			if (up <= 0 && down <= 0) {
				continue;
			}
			const result = palam + up - down;
			vm.getValue<IntChar1DValue>("PALAM").set(vm, result, [i]);
			vm.getValue<Int1DValue>("UP").set(vm, 0n, [i]);
			vm.getValue<Int1DValue>("DOWN").set(vm, 0n, [i]);

			if (!vm.printer.skipDisp) {
				const name = vm.code.csv.palam.get(i)!;
				let text = `${name} ${palam}`;
				if (up > 0) {
					text += `+${up}`;
				}
				if (down > 0) {
					text += `-${down}`;
				}
				text += `=${result}`;

				yield* vm.printer.print(text, new Set(["L"]));
			}
		}

		return null;
	}
}
