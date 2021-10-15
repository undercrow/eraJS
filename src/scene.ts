import Slice from "./slice";
import type {default as Statement} from "./statement";
import Call from "./statement/command/call";
import Input from "./statement/command/input";
import Print from "./statement/command/print";
import PrintC from "./statement/command/printc";
import TryCall from "./statement/command/trycall";
import Int1DValue from "./value/int-1d";
import VM from "./vm";

const FILE = "BUILTIN.ERB";

function* runScene(vm: VM, scene: () => Generator<Statement>): ReturnType<Statement["run"]> {
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
			run: function* () {
				return yield* fn.run(vm, []);
			},
		};
	}
}

export function* TITLE(vm: VM) {
	return yield* runScene(vm, function* () {
		yield new Call(new Slice(FILE, 0, "CALL SYSTEM_TITLE", "CALL".length));
	});
}

export function* FIRST(vm: VM) {
	return yield* runScene(vm, function* () {
		yield* eventStatement(vm, "EVENTFIRST");
	});
}

export function* SHOP(vm: VM) {
	return yield* runScene(vm, function* () {
		yield* eventStatement(vm, "EVENTSHOP");
		// TODO: autosave
		while (true) {
			yield new Call(new Slice(FILE, 0, "CALL SHOW_SHOP", "CALL".length));
			yield new Input(new Slice(FILE, 0, "INPUT", "INPUT".length));
			yield new Call(new Slice(FILE, 0, "CALL USERSHOP", "CALL".length));
		}
	});
}

export function* TRAIN(vm: VM) {
	return yield* runScene(vm, function* () {
		vm.getValue("ASSIPLAY").set(vm, 0, []);
		vm.getValue("PREVCOM").set(vm, -1, []);
		vm.getValue("NEXTCOM").set(vm, -1, []);
		vm.getValue<Int1DValue>("TFLAG").reset([]);
		for (const character of vm.characterList) {
			character.getValue<Int1DValue>("GOTJUEL").reset([]);
			character.getValue<Int1DValue>("TEQUIP").reset([]);
			character.getValue<Int1DValue>("EX").reset([]);
			character.getValue<Int1DValue>("PALAM").reset([]);
			character.getValue<Int1DValue>("SOURCE").reset([]);
			character.getValue<Int1DValue>("STAIN").reset([0, 0, 2, 1, 8]);
		}

		yield* eventStatement(vm, "EVENTTRAIN");

		while (true) {
			let selected: number | null = null;
			const nextCom = vm.getValue("NEXTCOM").get(vm, []) as number;
			if (nextCom >= 0) {
				vm.getValue("NEXTCOM").set(vm, 0, []);
				selected = nextCom;
			} else {
				const comAble: number[] = [];

				// TODO: Skip display on CTRAIN
				yield new Call(new Slice(FILE, 0, "CALL SHOW_STATUS", "CALL".length));

				let count = 0;
				for (const index of vm.code.data.train.keys()) {
					count += 1;
					vm.getValue("RESULT").set(vm, 1, []);
					yield new Call(new Slice(FILE, 0, `CALL COM_ABLE${index}`, "CALL".length));
					if (vm.getValue("RESULT").get(vm, []) !== 0) {
						comAble.push(index);
						const name = vm.code.data.train.get(index)!;
						const indexString = index.toString().padStart(3, " ");
						yield new PrintC(
							"RIGHT",
							"",
							new Slice(FILE, 0, `PRINTC ${name}[${indexString}]`, "PRINTC".length),
						);
						if (count % vm.printCPerLine === 0) {
							yield new Print("L", new Slice(FILE, 0, "PRINTL", "PRINTL".length));
						}
						// TODO: isCTrain
					}
				}
				yield new Call(new Slice(FILE, 0, "CALL SHOW_USERCOM", "CALL".length));

				vm.skipDisp = false;
				vm.getValue<Int1DValue>("UP").reset([]);
				vm.getValue<Int1DValue>("DOWN").reset([]);
				vm.getValue<Int1DValue>("LOSEBASE").reset([]);
				for (const character of vm.characterList) {
					character.getValue<Int1DValue>("DOWNBASE").reset([]);
					character.getValue<Int1DValue>("CUP").reset([]);
					character.getValue<Int1DValue>("CDOWN").reset([]);
				}

				yield new Input(new Slice(FILE, 0, "INPUT", "INPUT".length));
				const input = vm.getValue("RESULT").get(vm, [0]) as number;
				if (comAble.includes(input)) {
					selected = input;
				}
			}

			if (selected == null) {
				yield new Call(new Slice(FILE, 0, "CALL USERCOM", "CALL".length));
			} else {
				vm.getValue("SELECTCOM").set(vm, selected, []);
				for (const character of vm.characterList) {
					character.getValue<Int1DValue>("NOWEX").reset([]);
				}

				yield* eventStatement(vm, "EVENTCOM");
				yield new Call(new Slice(FILE, 0, `CALL COM${selected}`, "CALL".length));
				if (vm.getValue("RESULT").get(vm, [0]) !== 0) {
					yield new Call(new Slice(FILE, 0, "CALL SOURCE_CHECK", "CALL".length));
					for (const character of vm.characterList) {
						character.getValue<Int1DValue>("SOURCE").reset([]);
					}
					yield* eventStatement(vm, "EVENTCOMEND");
				}
			}
			// TODO: console.LastLineIsTemporary
			// TODO: Ctrain
			// TODO: NeedWaitToEventComEnd
		}
	});
}

export function* AFTERTRAIN(vm: VM) {
	return yield* runScene(vm, function* () {
		// TODO: Ctrain
		vm.skipDisp = false;
		yield* eventStatement(vm, "EVENTEND");
	});
}

export function* ABLUP(vm: VM) {
	return yield* runScene(vm, function* () {
		while (true) {
			vm.skipDisp = false;
			yield new Call(new Slice(FILE, 0, "CALL SHOW_JUEL", "CALL".length));
			yield new Call(new Slice(FILE, 0, "CALL SHOW_ABLUP_SELECT", "CALL".length));
			yield new Input(new Slice(FILE, 0, "INPUT", "INPUT".length));
			const input = vm.getValue("RESULT").get(vm, []) as number;
			if (input >= 0 && input < 100) {
				yield new Call(new Slice(FILE, 0, `CALL ABLUP${input}`, "CALL".length));
			} else {
				yield new Call(new Slice(FILE, 0, "CALL USERABLUP", "CALL".length));
			}
		}
	});
}

export function* TURNEND(vm: VM) {
	return yield* runScene(vm, function* () {
		vm.skipDisp = false;
		yield* eventStatement(vm, "EVENTTURNEND");
	});
}

export function* DATALOADED(vm: VM) {
	return yield* runScene(vm, function* () {
		yield new TryCall(new Slice(FILE, 0, "TRYCALL SYSTEM_LOADEND", "TRYCALL".length));
		yield* eventStatement(vm, "EVENTLOAD");
		while (true) {
			yield new Call(new Slice(FILE, 0, "CALL SHOW_SHOP", "CALL".length));
			yield new Input(new Slice(FILE, 0, "INPUT", "INPUT".length));
			yield new Call(new Slice(FILE, 0, "CALL USERSHOP", "CALL".length));
		}
	});
}
