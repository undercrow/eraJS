import * as assert from "../../assert";
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
import existCsv from "../method/existcsv";
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
import lineIsEmpty from "../method/lineisempty";
import match from "../method/match";
import max from "../method/max";
import maxArray from "../method/maxarray";
import min from "../method/min";
import minArray from "../method/minarray";
import power from "../method/power";
import rand from "../method/rand";
import sign from "../method/sign";
import sqrt from "../method/sqrt";
import strLenS from "../method/strlens";
import strLenSU from "../method/strlensu";
import sumArray from "../method/sumarray";
import toInt from "../method/toint";
import toStr from "../method/tostr";
import varSize from "../method/varsize";
import unicode from "../method/unicode";
async function runGenerator(gen) {
    while (true) {
        const value = await gen.next();
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
    async reduce(vm) {
        switch (this.name.toUpperCase()) {
            case "ABS": return abs(vm, this.arg);
            case "BARSTR": return barStr(vm, this.arg);
            case "CSVABL": return BigInt(await csvAbl(vm, this.arg));
            case "CSVBASE": return BigInt(await csvBase(vm, this.arg));
            case "CSVCALLNAME": return csvCallname(vm, this.arg);
            case "CSVCFLAG": return BigInt(await csvCflag(vm, this.arg));
            case "CSVCSTR": return csvCstr(vm, this.arg);
            case "CSVEQUIP": return BigInt(await csvEquip(vm, this.arg));
            case "CSVEXP": return BigInt(await csvExp(vm, this.arg));
            case "CSVJUEL": return BigInt(await csvJuel(vm, this.arg));
            case "CSVMARK": return BigInt(await csvMark(vm, this.arg));
            case "CSVMASTERNAME": return csvMastername(vm, this.arg);
            case "CSVNAME": return csvName(vm, this.arg);
            case "CSVNICKNAME": return csvNickname(vm, this.arg);
            case "CSVRELATION": return BigInt(await csvRelation(vm, this.arg));
            case "CSVTALENT": return BigInt(await csvTalent(vm, this.arg));
            case "EXISTCSV": return BigInt(await existCsv(vm, this.arg));
            case "FINDCHARA": return findChara(vm, this.arg);
            case "FINDLASTCHARA": return findLastChara(vm, this.arg);
            case "GETBGCOLOR": return BigInt(getBgColor(vm, this.arg));
            case "GETBIT": return BigInt(await getBit(vm, this.arg));
            case "GETCHARA": return BigInt(await getChara(vm, this.arg));
            case "GETCOLOR": return BigInt(getColor(vm, this.arg));
            case "GETDEFBGCOLOR": return BigInt(getDefBgColor(vm, this.arg));
            case "GETDEFCOLOR": return BigInt(getDefColor(vm, this.arg));
            case "GETFOCUSCOLOR": return BigInt(getFocusColor(vm, this.arg));
            case "GROUPMATCH": return BigInt(await groupMatch(vm, this.arg));
            case "INRANGE": return BigInt(await inRange(vm, this.arg));
            case "LIMIT": return limit(vm, this.arg);
            case "LINEISEMPTY": return BigInt(lineIsEmpty(vm, this.arg));
            case "MATCH": return BigInt(await match(vm, this.arg));
            case "MAX": return max(vm, this.arg);
            case "MAXARRAY": return maxArray(vm, this.arg);
            case "MIN": return min(vm, this.arg);
            case "MINARRAY": return minArray(vm, this.arg);
            case "POWER": return power(vm, this.arg);
            case "RAND": return rand(vm, this.arg);
            case "SIGN": return BigInt(await sign(vm, this.arg));
            case "SQRT": return sqrt(vm, this.arg);
            case "STRLENS": return BigInt(await strLenS(vm, this.arg));
            case "STRLENSU": return BigInt(await strLenSU(vm, this.arg));
            case "SUMARRAY": return sumArray(vm, this.arg);
            case "TOINT": return BigInt(await toInt(vm, this.arg));
            case "TOSTR": return toStr(vm, this.arg);
            case "VARSIZE": return BigInt(await varSize(vm, this.arg));
            case "UNICODE": return unicode(vm, this.arg);
            default: {
                assert.cond(vm.fnMap.has(this.name), `Method ${this.name} does not exist`);
                const values = [];
                for (const arg of this.arg) {
                    values.push(await arg.reduce(vm));
                }
                const result = await runGenerator(vm.fnMap.get(this.name).run(vm, values));
                assert.cond(result?.type === "return", "Inline call should return a value");
                return result.value[0];
            }
        }
    }
}
