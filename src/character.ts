import {Template} from "./csv/character";
import * as E from "./error";
import Value from "./value";
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
	public values: Map<string, Value<any>>;

	public constructor(vm: VM, template: Template) {
		this.values = new Map();
		for (const [name, value] of vm.globalMap) {
			if (value instanceof IntChar0DValue) {
				this.values.set(name, new Int0DValue(name));
			} else if (value instanceof IntChar1DValue) {
				this.values.set(name, new Int1DValue(name, [value.size]));
			} else if (value instanceof StrChar0DValue) {
				this.values.set(name, new Str0DValue(name));
			} else if (value instanceof StrChar1DValue) {
				this.values.set(name, new Str1DValue(name, [value.size]));
			}
		}
		this.getValue<Int0DValue>("NO").reset(template.no);
		this.getValue<Str0DValue>("NAME").reset(template.name);
		this.getValue<Str0DValue>("CALLNAME").reset(template.callname);
		this.getValue<Str0DValue>("NICKNAME").reset(template.nickname);
		this.getValue<Str0DValue>("MASTERNAME").reset(template.mastername);
		this.getValue<Int1DValue>("BASE").reset(template.maxBase);
		this.getValue<Int1DValue>("MAXBASE").reset(template.maxBase);
		this.getValue<Int1DValue>("MARK").reset(template.mark);
		this.getValue<Int1DValue>("EXP").reset(template.exp);
		this.getValue<Int1DValue>("ABL").reset(template.abl);
		this.getValue<Int1DValue>("TALENT").reset(template.talent);
		this.getValue<Int1DValue>("RELATION").reset(template.relation);
		this.getValue<Int1DValue>("CFLAG").reset(template.cflag);
		this.getValue<Int1DValue>("EQUIP").reset(template.equip);
		this.getValue<Int1DValue>("JUEL").reset(template.juel);
		this.getValue<Str1DValue>("CSTR").reset(template.cstr);
	}

	public getValue<T extends Value<any>>(name: string): T {
		if (this.values.has(name)) {
			return this.values.get(name) as T;
		} else {
			throw E.notFound("Character", name);
		}
	}
}
