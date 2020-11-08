import {assertNumber} from "../../assert";
import IntChar0DValue from "../../value/int-char-0d";
import IntChar1DValue from "../../value/int-char-1d";
import StrChar0DValue from "../../value/str-char-0d";
import StrChar1DValue from "../../value/str-char-1d";
import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

function removeCharacter(vm: VM, varName: string, index: number) {
	const value = vm.getValue(varName);
	const charaNum = vm.getValue("CHARANUM").get(vm, []) as number;
	for (let i = index; i < charaNum - 1; ++i) {
		if (value instanceof IntChar0DValue) {
			value.value.set(i, value.value.get(i + 1)!);
		} else if (value instanceof StrChar0DValue) {
			value.value.set(i, value.value.get(i + 1)!);
		} else if (value instanceof IntChar1DValue) {
			value.value.set(i, value.value.get(i + 1)!);
		} else if (value instanceof StrChar1DValue) {
			value.value.set(i, value.value.get(i + 1)!);
		} else {
			throw new Error(`${varName} is not a character variable`);
		}
	}
}

export default class DelChara extends Statement {
	public charaters: Expr[];

	public constructor(characters: Expr[]) {
		super();
		this.charaters = characters;
	}

	public *run(vm: VM) {
		const idList = this.charaters.map((c) => c.reduce(vm));
		idList.forEach((id) => assertNumber(id, "Character id should be an integer"));
		idList.sort();
		idList.reverse();

		const charaNum = vm.getValue("CHARANUM");
		for (const id of idList as number[]) {
			removeCharacter(vm, "NO", id);
			removeCharacter(vm, "NAME", id);
			removeCharacter(vm, "CALLNAME", id);
			removeCharacter(vm, "CFLAG", id);
			removeCharacter(vm, "TALENT", id);
			removeCharacter(vm, "MAXBASE", id);
			removeCharacter(vm, "BASE", id);
			removeCharacter(vm, "ABL", id);
			removeCharacter(vm, "EXP", id);
			removeCharacter(vm, "CSTR", id);
			removeCharacter(vm, "MARK", id);
			removeCharacter(vm, "PALAM", id);
			removeCharacter(vm, "JUEL", id);
			removeCharacter(vm, "EQUIP", id);
			removeCharacter(vm, "TEQUIP", id);
			removeCharacter(vm, "STAIN", id);
			removeCharacter(vm, "EX", id);
			removeCharacter(vm, "SOURCE", id);
			removeCharacter(vm, "NOWEX", id);
			removeCharacter(vm, "GOTJUEL", id);
			charaNum.set(vm, charaNum.get(vm, []) as number - 1, []);
		}

		return null;
	}
}
