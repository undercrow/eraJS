import { assert } from "../../assert";
import abs from "../method/abs";
import barStr from "../method/barstr";
import csvAbl from "../method/csvabl";
import csvBase from "../method/csvbase";
import csvCallname from "../method/csvcallname";
import csvCflag from "../method/csvcflag";
import csvCstr from "../method/csvcstr";
import csvEquip from "../method/csvequip";
import csvExp from "../method/csvexp";
import csvJuel from "../method/csvjuel";
import csvMark from "../method/csvmark";
import csvMastername from "../method/csvmastername";
import csvName from "../method/csvname";
import csvNickname from "../method/csvnickname";
import csvRelation from "../method/csvrelation";
import csvTalent from "../method/csvtalent";
import findChara from "../method/findchara";
import findLastChara from "../method/findlastchara";
import getBgColor from "../method/getbgcolor";
import getBit from "../method/getbit";
import getChara from "../method/getchara";
import getColor from "../method/getcolor";
import getDefBgColor from "../method/getdefbgcolor";
import getDefColor from "../method/getdefcolor";
import getFocusColor from "../method/getfocuscolor";
import groupMatch from "../method/groupmatch";
import inRange from "../method/inrange";
import limit from "../method/limit";
import match from "../method/match";
import max from "../method/max";
import maxArray from "../method/maxarray";
import min from "../method/min";
import minArray from "../method/minarray";
import rand from "../method/rand";
import sign from "../method/sign";
import strLenS from "../method/strlens";
import sumArray from "../method/sumarray";
import toInt from "../method/toint";
import toStr from "../method/tostr";
import varSize from "../method/varsize";
import unicode from "../method/unicode";
function runGenerator(gen) {
    while (true) {
        const value = gen.next();
        if (value.done === true) {
            return value.value;
        }
    }
}
export default class InlineCall {
    name;
    arg;
    constructor(name, arg) {
        this.name = name.toUpperCase();
        this.arg = arg;
    }
    reduce(vm) {
        switch (this.name.toUpperCase()) {
            case "ABS": return abs(vm, this.arg);
            case "BARSTR": return barStr(vm, this.arg);
            case "CSVABL": return csvAbl(vm, this.arg);
            case "CSVBASE": return csvBase(vm, this.arg);
            case "CSVCALLNAME": return csvCallname(vm, this.arg);
            case "CSVCFLAG": return csvCflag(vm, this.arg);
            case "CSVCSTR": return csvCstr(vm, this.arg);
            case "CSVEQUIP": return csvEquip(vm, this.arg);
            case "CSVEXP": return csvExp(vm, this.arg);
            case "CSVJUEL": return csvJuel(vm, this.arg);
            case "CSVMARK": return csvMark(vm, this.arg);
            case "CSVMASTERNAME": return csvMastername(vm, this.arg);
            case "CSVNAME": return csvName(vm, this.arg);
            case "CSVNICKNAME": return csvNickname(vm, this.arg);
            case "CSVRELATION": return csvRelation(vm, this.arg);
            case "CSVTALENT": return csvTalent(vm, this.arg);
            case "FINDCHARA": return findChara(vm, this.arg);
            case "FINDLASTCHARA": return findLastChara(vm, this.arg);
            case "GETBGCOLOR": return getBgColor(vm, this.arg);
            case "GETBIT": return getBit(vm, this.arg);
            case "GETCHARA": return getChara(vm, this.arg);
            case "GETCOLOR": return getColor(vm, this.arg);
            case "GETDEFBGCOLOR": return getDefBgColor(vm, this.arg);
            case "GETDEFCOLOR": return getDefColor(vm, this.arg);
            case "GETFOCUSCOLOR": return getFocusColor(vm, this.arg);
            case "GROUPMATCH": return groupMatch(vm, this.arg);
            case "INRANGE": return inRange(vm, this.arg);
            case "LIMIT": return limit(vm, this.arg);
            case "MATCH": return match(vm, this.arg);
            case "MAX": return max(vm, this.arg);
            case "MAXARRAY": return maxArray(vm, this.arg);
            case "MIN": return min(vm, this.arg);
            case "MINARRAY": return minArray(vm, this.arg);
            case "RAND": return rand(vm, this.arg);
            case "SIGN": return sign(vm, this.arg);
            case "STRLENS": return strLenS(vm, this.arg);
            case "SUMARRAY": return sumArray(vm, this.arg);
            case "TOINT": return toInt(vm, this.arg);
            case "TOSTR": return toStr(vm, this.arg);
            case "VARSIZE": return varSize(vm, this.arg);
            case "UNICODE": return unicode(vm, this.arg);
            default: {
                assert(vm.fnMap.has(this.name), `Method ${this.name} does not exist`);
                const values = this.arg.map((arg) => arg.reduce(vm));
                const result = runGenerator(vm.fnMap.get(this.name).run(vm, values));
                assert(result?.type === "return", "Inline call should return a value");
                return result.value[0];
            }
        }
    }
}
