import type {default as Statement} from "./statement";
import Call from "./statement/command/call";
import Input from "./statement/command/input";
import Int1DValue from "./value/int-1d";
import VM from "./vm";

function* runScene(vm: VM, scene: () => Generator<Statement>): ReturnType<Statement["run"]> {
	const generator = scene();
	while (true) {
		const next = generator.next();
		if (next.done === true) {
			return null;
		}

		const statement = next.value;
		const result = yield* statement.run(vm);
		if (result != null && result.type !== "return") {
			return result;
		}
	}
}

function* eventStatement(vm: VM, target: string) {
	for (const fn of vm.eventMap.get(target) ?? []) {
		yield {
			run: function* () {
				return yield* fn.run(vm, []);
			},
		};
	}
}

export function* TITLE(vm: VM) {
	return yield* runScene(vm, function* () {
		yield new Call("SYSTEM_TITLE", []);
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
			yield new Call("SHOW_SHOP", []);
			yield new Input("");
			yield new Call("USERSHOP", []);
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
				yield new Call("SHOW_STATUS", []);
				for (const index of vm.code.data.train.keys()) {
					vm.getValue("RESULT").set(vm, 1, []);
					yield new Call(`COM_ABLE${index}`, []);
					if (vm.getValue("RESULT").get(vm, []) !== 0) {
						comAble.push(index);
						// TODO: isCTrain
					}
				}
				yield new Call("SHOW_USERCOM", []);

				vm.skipDisp = false;
				vm.getValue<Int1DValue>("UP").reset([]);
				vm.getValue<Int1DValue>("DOWN").reset([]);
				vm.getValue<Int1DValue>("LOSEBASE").reset([]);
				for (const character of vm.characterList) {
					character.getValue<Int1DValue>("DOWNBASE").reset([]);
					character.getValue<Int1DValue>("CUP").reset([]);
					character.getValue<Int1DValue>("CDOWN").reset([]);
				}

				yield new Input("");
				const input = vm.getValue("RESULT").get(vm, [0]) as number;
				if (comAble.includes(input)) {
					selected = input;
				}
			}

			if (selected == null) {
				yield new Call("USERCOM", []);
			} else {
				vm.getValue("SELECTCOM").set(vm, selected, []);
				for (const character of vm.characterList) {
					character.getValue<Int1DValue>("NOWEX").reset([]);
				}

				yield* eventStatement(vm, "EVENTCOM");
				yield new Call(`COM${selected}`, []);
				if (vm.getValue("RESULT").get(vm, [0]) !== 0) {
					yield new Call("SOURCE_CHECK", []);
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
			yield new Call("SHOW_JUEL", []);
			yield new Call("SHOW_ABLUP_SELECT", []);
			yield new Input("");
			const input = vm.getValue("RESULT").get(vm, []) as number;
			if (input >= 0 && input < 100) {
				yield new Call(`ABLUP${input}`, []);
			} else {
				yield new Call("USERABLUP", []);
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
