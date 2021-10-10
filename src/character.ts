import {Template} from "./data";
import {SimpleValue} from "./value";
import Int0DValue from "./value/int-0d";
import Int1DValue from "./value/int-1d";
import IntChar0DValue from "./value/int-char-0d";
import IntChar1DValue from "./value/int-char-1d";
import Str0DValue from "./value/str-0d";
import Str1DValue from "./value/str-1d";
import StrChar0DValue from "./value/str-char-0d";
import StrChar1DValue from "./value/str-char-1d";
import VM from "./vm";

export default class Character {
	public values: Map<string, SimpleValue>;

	public constructor(vm: VM, template: Template) {
		this.values = new Map();
		for (const [name, value] of vm.globalMap) {
			if (value instanceof IntChar0DValue) {
				this.values.set(name, new Int0DValue(name));
			} else if (value instanceof IntChar1DValue) {
				this.values.set(name, new Int1DValue(name, value.size));
			} else if (value instanceof StrChar0DValue) {
				this.values.set(name, new Str0DValue(name));
			} else if (value instanceof StrChar1DValue) {
				this.values.set(name, new Str1DValue(name, value.size));
			}
		}
		(this.values.get("NO") as Int0DValue).reset(template.id);
		(this.values.get("NAME") as Str0DValue).reset(template.name);
		(this.values.get("CALLNAME") as Str0DValue).reset(template.callname);
		(this.values.get("NICKNAME") as Str0DValue).reset(template.nickname);
		(this.values.get("MASTERNAME") as Str0DValue).reset(template.mastername);
		(this.values.get("BASE") as Int1DValue).reset(template.maxBase);
		(this.values.get("MAXBASE") as Int1DValue).reset(template.maxBase);
		(this.values.get("MARK") as Int1DValue).reset(template.mark);
		(this.values.get("EXP") as Int1DValue).reset(template.exp);
		(this.values.get("ABL") as Int1DValue).reset(template.abilities);
		(this.values.get("TALENT") as Int1DValue).reset(template.talent);
		// TODO: RELATION
		(this.values.get("CFLAG") as Int1DValue).reset(template.flags);
		// TODO: EQUIP
		(this.values.get("JUEL") as Int1DValue).reset(template.juel);
		(this.values.get("CSTR") as Str1DValue).reset(template.cstr);
	}

	public getValue<T extends SimpleValue>(name: string): T {
		if (this.values.has(name)) {
			return this.values.get(name) as T;
		} else {
			throw new Error(`Character variable ${name} does not exist`);
		}
	}
}
