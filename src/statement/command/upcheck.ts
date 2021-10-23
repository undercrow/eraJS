import * as U from "../../parser/util";
import Slice from "../../slice";
import type VM from "../../vm";
import Statement from "../index";

const PARSER = U.arg0R0();
export default class UpCheck extends Statement {
	public constructor(raw: Slice) {
		super(raw);

		U.tryParse(PARSER, raw);
	}

	public *run(vm: VM) {
		const target = vm.getValue("TARGET").get(vm, [0]) as number;
		const length = Math.min(
			vm.getValue("PALAM").length(1),
			vm.getValue("UP").length(0),
			vm.getValue("DOWN").length(0),
		);

		for (let i = 0; i < length; ++i) {
			const up = vm.getValue("UP").get(vm, [i]) as number;
			const down = vm.getValue("DOWN").get(vm, [i]) as number;
			const palam = vm.getValue("PALAM").get(vm, [target, i]) as number;

			if (up <= 0 && down <= 0) {
				continue;
			}
			const result = palam + up - down;
			vm.getValue("PALAM").set(vm, result, [target, i]);
			vm.getValue("UP").set(vm, 0, [i]);
			vm.getValue("DOWN").set(vm, 0, [i]);

			if (!vm.queue.skipDisp) {
				const name = vm.code.data.palam.get(i)!;
				let text = `${name} ${palam}`;
				if (up > 0) {
					text += `+${up}`;
				}
				if (down > 0) {
					text += `-${down}`;
				}
				text += `=${result}`;

				yield* vm.queue.print(text);
				yield* vm.queue.newline();
			}
		}

		return null;
	}
}
