import * as E from "./error";
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
        this.getValue("NO").reset(template.no);
        this.getValue("NAME").reset(template.name);
        this.getValue("CALLNAME").reset(template.callname);
        this.getValue("NICKNAME").reset(template.nickname);
        this.getValue("MASTERNAME").reset(template.mastername);
        this.getValue("BASE").reset(template.maxBase);
        this.getValue("MAXBASE").reset(template.maxBase);
        this.getValue("MARK").reset(template.mark);
        this.getValue("EXP").reset(template.exp);
        this.getValue("ABL").reset(template.abl);
        this.getValue("TALENT").reset(template.talent);
        this.getValue("RELATION").reset(template.relation);
        this.getValue("CFLAG").reset(template.cflag);
        this.getValue("EQUIP").reset(template.equip);
        this.getValue("JUEL").reset(template.juel);
        this.getValue("CSTR").reset(template.cstr);
    }
    getValue(name) {
        if (this.values.has(name)) {
            return this.values.get(name);
        }
        else {
            throw E.notFound("Character", name);
        }
    }
}
