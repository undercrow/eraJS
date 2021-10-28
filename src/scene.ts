import dayjs from "dayjs";

import Slice from "./slice";
import type {default as Statement, EraGenerator} from "./statement";
import Call from "./statement/command/call";
import Input from "./statement/command/input";
import Print from "./statement/command/print";
import PrintC from "./statement/command/printc";
import SaveData from "./statement/command/savedata";
import TryCall from "./statement/command/trycall";
import Wait from "./statement/command/wait";
import Int1DValue from "./value/int-1d";
import VM from "./vm";

const FILE = "BUILTIN.ERB";

async function* runScene(vm: VM, scene: () => Generator<Statement>): EraGenerator {
	const generator = scene();
	while (true) {
		const next = generator.next();
		if (next.done === true) {
			return null;
		}

		const result = yield* vm.run(next.value);
		if (result != null && result.type !== "return") {
			return result;
		}
	}
}

function* eventStatement(vm: VM, target: string) {
	for (const fn of vm.eventMap.get(target) ?? []) {
		yield {
			raw: new Slice(FILE, 0, "CALL " + target, "CALL".length),
			run: async function* () {
				return yield* fn.run(vm, []);
			},
		};
	}
}

function* MAIN() {
	while (true) {
		yield new Call(new Slice(FILE, 0, "CALL SHOW_SHOP", "CALL".length));
		yield new Input(new Slice(FILE, 0, "INPUT", "INPUT".length));
		yield new Call(new Slice(FILE, 0, "CALL USERSHOP", "CALL".length));
		// TODO: Check isLineTemp
	}
}

export async function* SHOP(vm: VM) {
	return yield* runScene(vm, function* () {
		yield* eventStatement(vm, "EVENTSHOP");
		if (vm.fnMap.has("SYSTEM_AUTOSAVE")) {
			yield new Call(new Slice(FILE, 0, "CALL SYSTEM_AUTOSAVE", "CALL".length));
		} else {
			const now = dayjs(vm.external.getTime());
			vm.getValue("SAVEDATA_TEXT").set(vm, now.format("YYYY/MM/DD HH:mm:ss"), []);
			yield new Call(new Slice(FILE, 0, "CALL SAVEINFO", "CALL".length));
			yield new SaveData(new Slice(FILE, 0, "SAVEDATA 99 SAVEDATA_TEXT"));
		}

		yield* MAIN();
	});
}

export async function* TRAIN(vm: VM) {
	return yield* runScene(vm, function* () {
		vm.getValue("ASSIPLAY").set(vm, 0, []);
		vm.getValue("PREVCOM").set(vm, -1, []);
		vm.getValue("NEXTCOM").set(vm, -1, []);
		vm.getValue("TFLAG").reset([]);
		vm.getValue("TSTR").reset([]);
		for (const character of vm.characterList) {
			character.getValue("GOTJUEL").reset([]);
			character.getValue("TEQUIP").reset([]);
			character.getValue("EX").reset([]);
			// TODO: Use values from _Replace.CSV
			character.getValue<Int1DValue>("STAIN").reset([0, 0, 2, 1, 8]);
			character.getValue("PALAM").reset([]);
			character.getValue("SOURCE").reset([]);
			character.getValue("TCVAR").reset([]);
		}

		yield* eventStatement(vm, "EVENTTRAIN");
		while (true) {
			const nextCom = vm.getValue<Int1DValue>("NEXTCOM").get(vm, []);
			if (nextCom >= 0) {
				vm.getValue("SELECTCOM").set(vm, nextCom, []);
				vm.getValue("NEXTCOM").set(vm, 0, []);
			} else {
				const comAble = new Set<number>();

				yield new Call(new Slice(FILE, 0, "CALL SHOW_STATUS", "CALL".length));
				const trainIds = [...vm.code.csv.train.keys()];
				trainIds.sort((a, b) => a - b);
				for (let i = 0; i < trainIds.length; ++i) {
					const id = trainIds[i];
					// TODO: Set to 0 if configured to disable command by default
					vm.getValue("RESULT").set(vm, 1, []);
					if (vm.fnMap.has(`COM_ABLE${id}`)) {
						yield new Call(new Slice(FILE, 0, `CALL COM_ABLE${id}`, "CALL".length));
					}
					if (vm.getValue("RESULT").get(vm, []) !== 0) {
						comAble.add(id);
						const name = vm.code.csv.train.get(id)!;
						const idString = id.toString().padStart(3, " ");
						yield new PrintC(
							"RIGHT",
							[],
							new Slice(FILE, 0, `PRINTC ${name}[${idString}]`, "PRINTC".length),
						);
						if (i % vm.printCPerLine === 0) {
							yield new Print(["L"], new Slice(FILE, 0, "PRINTL", "PRINTL".length));
						}
					}
				}

				yield new Call(new Slice(FILE, 0, "CALL SHOW_USERCOM", "CALL".length));

				yield new Input(new Slice(FILE, 0, "INPUT", "INPUT".length));
				const input = vm.getValue("RESULT").get(vm, [0]) as number;
				if (comAble.has(input)) {
					vm.getValue("SELECTCOM").set(vm, input, []);
				} else {
					vm.getValue("SELECTCOM").set(vm, -1, []);
				}
			}

			while (true) {
				let wait = false;
				const selectCom = vm.getValue<Int1DValue>("SELECTCOM").get(vm, []);
				if (selectCom >= 0) {
					for (const character of vm.characterList) {
						character.getValue<Int1DValue>("NOWEX").reset([]);
					}
					yield* eventStatement(vm, "EVENTCOM");

					yield new Call(new Slice(FILE, 0, `CALL COM${selectCom}`, "CALL".length));
					if (vm.getValue("RESULT").get(vm, [0]) !== 0) {
						wait = true;
						yield new Call(new Slice(FILE, 0, "CALL SOURCE_CHECK", "CALL".length));
						for (const character of vm.characterList) {
							character.getValue<Int1DValue>("SOURCE").reset([]);
						}
						yield* eventStatement(vm, "EVENTCOMEND");
					}
				} else {
					yield new Call(new Slice(FILE, 0, "CALL USERCOM", "CALL".length));
				}

				if (wait) {
					yield new Wait(new Slice(FILE, 0, "WAIT", "WAIT".length));
				}

				// TODO: Check isLineTemp

				break;
			}
		}
	});
}

export async function* AFTERTRAIN(vm: VM) {
	return yield* runScene(vm, function* () {
		vm.queue.skipDisp = false;
		yield* eventStatement(vm, "EVENTEND");
	});
}

export async function* ABLUP(vm: VM) {
	return yield* runScene(vm, function* () {
		while (true) {
			vm.queue.skipDisp = false;
			yield new Call(new Slice(FILE, 0, "CALL SHOW_JUEL", "CALL".length));
			yield new Call(new Slice(FILE, 0, "CALL SHOW_ABLUP_SELECT", "CALL".length));
			yield new Input(new Slice(FILE, 0, "INPUT", "INPUT".length));
			const input = vm.getValue("RESULT").get(vm, []) as number;
			if (input >= 0 && input < 100) {
				// TODO: Print temp line if ABLUP does not exists
				yield new TryCall(new Slice(FILE, 0, `TRYCALL ABLUP${input}`, "TRYCALL".length));
			} else {
				yield new Call(new Slice(FILE, 0, "CALL USERABLUP", "CALL".length));
			}
			// TODO: Check isLineTemp
		}
	});
}

export async function* TURNEND(vm: VM) {
	return yield* runScene(vm, function* () {
		vm.queue.skipDisp = false;
		yield* eventStatement(vm, "EVENTTURNEND");
	});
}

export async function* FIRST(vm: VM) {
	return yield* runScene(vm, function* () {
		yield* eventStatement(vm, "EVENTFIRST");
	});
}

export async function* TITLE(vm: VM) {
	return yield* runScene(vm, function* () {
		yield new Call(new Slice(FILE, 0, "CALL SYSTEM_TITLE", "CALL".length));
	});
}

export async function* DATALOADED(vm: VM) {
	return yield* runScene(vm, function* () {
		yield new TryCall(new Slice(FILE, 0, "TRYCALL SYSTEM_LOADEND", "TRYCALL".length));
		yield* eventStatement(vm, "EVENTLOAD");
		yield* MAIN();
	});
}
