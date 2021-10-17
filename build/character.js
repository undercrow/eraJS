import * as EM from "./error";
import Int0DValue from "./value/int-0d";
import Int1DValue from "./value/int-1d";
import IntChar0DValue from "./value/int-char-0d";
import IntChar1DValue from "./value/int-char-1d";
import Str0DValue from "./value/str-0d";
import Str1DValue from "./value/str-1d";
import StrChar0DValue from "./value/str-char-0d";
import StrChar1DValue from "./value/str-char-1d";
export default class Character {
    values;
    constructor(vm, template) {
        this.values = new Map();
        for (const [name, value] of vm.globalMap) {
            if (value instanceof IntChar0DValue) {
                this.values.set(name, new Int0DValue(name));
            }
            else if (value instanceof IntChar1DValue) {
                this.values.set(name, new Int1DValue(name, value.size));
            }
            else if (value instanceof StrChar0DValue) {
                this.values.set(name, new Str0DValue(name));
            }
            else if (value instanceof StrChar1DValue) {
                this.values.set(name, new Str1DValue(name, value.size));
            }
        }
        this.values.get("NO").reset(template.id);
        this.values.get("NAME").reset(template.name);
        this.values.get("CALLNAME").reset(template.callname);
        this.values.get("NICKNAME").reset(template.nickname);
        this.values.get("MASTERNAME").reset(template.mastername);
        this.values.get("BASE").reset(template.maxBase);
        this.values.get("MAXBASE").reset(template.maxBase);
        this.values.get("MARK").reset(template.mark);
        this.values.get("EXP").reset(template.exp);
        this.values.get("ABL").reset(template.abilities);
        this.values.get("TALENT").reset(template.talent);
        // TODO: RELATION
        this.values.get("CFLAG").reset(template.flags);
        // TODO: EQUIP
        this.values.get("JUEL").reset(template.juel);
        this.values.get("CSTR").reset(template.cstr);
    }
    getValue(name) {
        if (this.values.has(name)) {
            return this.values.get(name);
        }
        else {
            throw EM.notFound("Character", name);
        }
    }
}
