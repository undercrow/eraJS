import {Template} from "./data";
import Value from "./value";
import Int0DValue from "./value/int-0d";
import Int1DValue from "./value/int-1d";
import IntChar1DValue from "./value/int-char-1d";
import Str0DValue from "./value/str-0d";
import Str1DValue from "./value/str-1d";
import StrChar1DValue from "./value/str-char-1d";
import VM from "./vm";

export default class Character {
	public values: Map<string, Value>;

	public constructor(vm: VM, template: Template) {
		this.values = new Map();
		this.setInt0DValue(vm, "NO", template.id);
		this.setInt0DValue(vm, "ISASSI", 0);
		this.setStr0DValue(vm, "NAME", template.name);
		this.setStr0DValue(vm, "CALLNAME", template.callname);
		this.setInt1DValue(vm, "BASE", template.base);
		this.setInt1DValue(vm, "MAXBASE", template.maxBase);
		this.setInt1DValue(vm, "ABL", template.abilities);
		this.setInt1DValue(vm, "TALENT", template.talent);
		this.setInt1DValue(vm, "EXP", template.exp);
		this.setInt1DValue(vm, "MARK", template.mark);
		this.setInt1DValue(vm, "RELATION");
		this.setInt1DValue(vm, "JUEL", template.juel);
		this.setInt1DValue(vm, "CFLAG", template.flags);
		this.setInt1DValue(vm, "EQUIP");
		this.setInt1DValue(vm, "TEQUIP");
		this.setInt1DValue(vm, "PALAM", template.palam);
		this.setInt1DValue(vm, "STAIN");
		this.setInt1DValue(vm, "EX");
		this.setInt1DValue(vm, "SOURCE");
		this.setInt1DValue(vm, "NOWEX");
		this.setInt1DValue(vm, "GOTJUEL");
		this.setStr0DValue(vm, "NICKNAME", template.nickname);
		this.setStr0DValue(vm, "MASTERNAME", template.mastername);
		this.setInt1DValue(vm, "DOWNBASE");
		this.setInt1DValue(vm, "CUP");
		this.setInt1DValue(vm, "CDOWN");
		this.setInt1DValue(vm, "TCVAR");
		this.setStr1DValue(vm, "CSTR", template.cstr);
	}

	private setInt0DValue(_vm: VM, name: string, from?: number) {
		const result = new Int0DValue(name);
		this.values.set(name, from != null ? result.reset(from) : result);
	}

	private setStr0DValue(_vm: VM, name: string, from?: string) {
		const result = new Str0DValue(name);
		this.values.set(name, from != null ? result.reset(from) : result);
	}

	private setInt1DValue(vm: VM, name: string, from?: number[] | Map<number, number>) {
		const size = vm.getValue<IntChar1DValue>(name).size;
		const result = new Int1DValue(name, size);
		if (from != null) {
			for (const [i, value] of from.entries()) {
				result.set(vm, value, [i]);
			}
		}
		this.values.set(name, result);
	}

	private setStr1DValue(vm: VM, name: string, from?: string[] | Map<number, string>) {
		const size = vm.getValue<StrChar1DValue>(name).size;
		const result = new Str1DValue(name, size);
		if (from != null) {
			for (const [i, value] of from.entries()) {
				result.set(vm, value, [i]);
			}
		}
		this.values.set(name, result);
	}

	public getValue<T extends Value>(name: string): T {
		return this.values.get(name) as T;
	}
}
