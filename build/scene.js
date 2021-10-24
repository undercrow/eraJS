import Slice from "./slice";
import Call from "./statement/command/call";
import Input from "./statement/command/input";
import Print from "./statement/command/print";
import PrintC from "./statement/command/printc";
import TryCall from "./statement/command/trycall";
const FILE = "BUILTIN.ERB";
function* runScene(vm, scene) {
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
function* eventStatement(vm, target) {
    for (const fn of vm.eventMap.get(target) ?? []) {
        yield {
            raw: new Slice(FILE, 0, "CALL " + target, "CALL".length),
            run: function* () {
                return yield* fn.run(vm, []);
            },
        };
    }
}
export function* TITLE(vm) {
    return yield* runScene(vm, function* () {
        yield new Call(new Slice(FILE, 0, "CALL SYSTEM_TITLE", "CALL".length));
    });
}
export function* FIRST(vm) {
    return yield* runScene(vm, function* () {
        yield* eventStatement(vm, "EVENTFIRST");
    });
}
export function* SHOP(vm) {
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
export function* TRAIN(vm) {
    return yield* runScene(vm, function* () {
        vm.getValue("ASSIPLAY").set(vm, 0, []);
        vm.getValue("PREVCOM").set(vm, -1, []);
        vm.getValue("NEXTCOM").set(vm, -1, []);
        vm.getValue("TFLAG").reset([]);
        for (const character of vm.characterList) {
            character.getValue("GOTJUEL").reset([]);
            character.getValue("TEQUIP").reset([]);
            character.getValue("EX").reset([]);
            character.getValue("PALAM").reset([]);
            character.getValue("SOURCE").reset([]);
            character.getValue("STAIN").reset([0, 0, 2, 1, 8]);
        }
        yield* eventStatement(vm, "EVENTTRAIN");
        while (true) {
            let selected = null;
            const nextCom = vm.getValue("NEXTCOM").get(vm, []);
            if (nextCom >= 0) {
                vm.getValue("NEXTCOM").set(vm, 0, []);
                selected = nextCom;
            }
            else {
                const comAble = [];
                // TODO: Skip display on CTRAIN
                yield new Call(new Slice(FILE, 0, "CALL SHOW_STATUS", "CALL".length));
                let count = 0;
                for (const index of vm.code.data.train.keys()) {
                    count += 1;
                    vm.getValue("RESULT").set(vm, 1, []);
                    yield new Call(new Slice(FILE, 0, `CALL COM_ABLE${index}`, "CALL".length));
                    if (vm.getValue("RESULT").get(vm, []) !== 0) {
                        comAble.push(index);
                        const name = vm.code.data.train.get(index);
                        const indexString = index.toString().padStart(3, " ");
                        yield new PrintC("RIGHT", [], new Slice(FILE, 0, `PRINTC ${name}[${indexString}]`, "PRINTC".length));
                        if (count % vm.printCPerLine === 0) {
                            yield new Print(["L"], new Slice(FILE, 0, "PRINTL", "PRINTL".length));
                        }
                        // TODO: isCTrain
                    }
                }
                yield new Call(new Slice(FILE, 0, "CALL SHOW_USERCOM", "CALL".length));
                vm.queue.skipDisp = false;
                vm.getValue("UP").reset([]);
                vm.getValue("DOWN").reset([]);
                vm.getValue("LOSEBASE").reset([]);
                for (const character of vm.characterList) {
                    character.getValue("DOWNBASE").reset([]);
                    character.getValue("CUP").reset([]);
                    character.getValue("CDOWN").reset([]);
                }
                yield new Input(new Slice(FILE, 0, "INPUT", "INPUT".length));
                const input = vm.getValue("RESULT").get(vm, [0]);
                if (comAble.includes(input)) {
                    selected = input;
                }
            }
            if (selected == null) {
                yield new Call(new Slice(FILE, 0, "CALL USERCOM", "CALL".length));
            }
            else {
                vm.getValue("SELECTCOM").set(vm, selected, []);
                for (const character of vm.characterList) {
                    character.getValue("NOWEX").reset([]);
                }
                yield* eventStatement(vm, "EVENTCOM");
                yield new Call(new Slice(FILE, 0, `CALL COM${selected}`, "CALL".length));
                if (vm.getValue("RESULT").get(vm, [0]) !== 0) {
                    yield new Call(new Slice(FILE, 0, "CALL SOURCE_CHECK", "CALL".length));
                    for (const character of vm.characterList) {
                        character.getValue("SOURCE").reset([]);
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
export function* AFTERTRAIN(vm) {
    return yield* runScene(vm, function* () {
        // TODO: Ctrain
        vm.queue.skipDisp = false;
        yield* eventStatement(vm, "EVENTEND");
    });
}
export function* ABLUP(vm) {
    return yield* runScene(vm, function* () {
        while (true) {
            vm.queue.skipDisp = false;
            yield new Call(new Slice(FILE, 0, "CALL SHOW_JUEL", "CALL".length));
            yield new Call(new Slice(FILE, 0, "CALL SHOW_ABLUP_SELECT", "CALL".length));
            yield new Input(new Slice(FILE, 0, "INPUT", "INPUT".length));
            const input = vm.getValue("RESULT").get(vm, []);
            if (input >= 0 && input < 100) {
                yield new Call(new Slice(FILE, 0, `CALL ABLUP${input}`, "CALL".length));
            }
            else {
                yield new Call(new Slice(FILE, 0, "CALL USERABLUP", "CALL".length));
            }
        }
    });
}
export function* TURNEND(vm) {
    return yield* runScene(vm, function* () {
        vm.queue.skipDisp = false;
        yield* eventStatement(vm, "EVENTTURNEND");
    });
}
export function* DATALOADED(vm) {
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
