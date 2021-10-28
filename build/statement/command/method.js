import * as E from "../../error";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
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
const PARSER = U.argNR0(X.expr);
export default class Method extends Statement {
    name;
    arg;
    constructor(name, raw) {
        super(raw);
        this.name = name;
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const arg = this.arg.get();
        let result;
        switch (this.name) {
            case "ABS":
                result = await abs(vm, arg);
                break;
            case "BARSTR":
                result = await barStr(vm, arg);
                break;
            case "CSVABL":
                result = await csvAbl(vm, arg);
                break;
            case "CSVBASE":
                result = await csvBase(vm, arg);
                break;
            case "CSVCALLNAME":
                result = await csvCallname(vm, arg);
                break;
            case "CSVCFLAG":
                result = await csvCflag(vm, arg);
                break;
            case "CSVCSTR":
                result = await csvCstr(vm, arg);
                break;
            case "CSVEQUIP":
                result = await csvEquip(vm, arg);
                break;
            case "CSVEXP":
                result = await csvExp(vm, arg);
                break;
            case "CSVJUEL":
                result = await csvJuel(vm, arg);
                break;
            case "CSVMARK":
                result = await csvMark(vm, arg);
                break;
            case "CSVMASTERNAME":
                result = await csvMastername(vm, arg);
                break;
            case "CSVNAME":
                result = await csvName(vm, arg);
                break;
            case "CSVNICKNAME":
                result = await csvNickname(vm, arg);
                break;
            case "CSVRELATION":
                result = await csvRelation(vm, arg);
                break;
            case "CSVTALENT":
                result = await csvTalent(vm, arg);
                break;
            case "EXISTCSV":
                result = await existCsv(vm, arg);
                break;
            case "FINDCHARA":
                result = await findChara(vm, arg);
                break;
            case "FINDLASTCHARA":
                result = await findLastChara(vm, arg);
                break;
            case "GETBGCOLOR":
                result = getBgColor(vm, arg);
                break;
            case "GETBIT":
                result = await getBit(vm, arg);
                break;
            case "GETCHARA":
                result = await getChara(vm, arg);
                break;
            case "GETCOLOR":
                result = getColor(vm, arg);
                break;
            case "GETDEFBGCOLOR":
                result = getDefBgColor(vm, arg);
                break;
            case "GETDEFCOLOR":
                result = getDefColor(vm, arg);
                break;
            case "GETFOCUSCOLOR":
                result = getFocusColor(vm, arg);
                break;
            case "GROUPMATCH":
                result = await groupMatch(vm, arg);
                break;
            case "INRANGE":
                result = await inRange(vm, arg);
                break;
            case "LIMIT":
                result = await limit(vm, arg);
                break;
            case "LINEISEMPTY":
                result = lineIsEmpty(vm, arg);
                break;
            case "MATCH":
                result = await match(vm, arg);
                break;
            case "MAX":
                result = await max(vm, arg);
                break;
            case "MAXARRAY":
                result = await maxArray(vm, arg);
                break;
            case "MIN":
                result = await min(vm, arg);
                break;
            case "MINARRAY":
                result = await minArray(vm, arg);
                break;
            case "POWER":
                result = await power(vm, arg);
                break;
            case "RAND":
                result = await rand(vm, arg);
                break;
            case "SIGN":
                result = await sign(vm, arg);
                break;
            case "SQRT":
                result = await sqrt(vm, arg);
                break;
            case "STRLENS":
                result = await strLenS(vm, arg);
                break;
            case "STRLENSU":
                result = await strLenSU(vm, arg);
                break;
            case "SUMARRAY":
                result = await sumArray(vm, arg);
                break;
            case "TOINT":
                result = await toInt(vm, arg);
                break;
            case "TOSTR":
                result = await toStr(vm, arg);
                break;
            case "VARSIZE":
                result = await varSize(vm, arg);
                break;
            case "UNICODE":
                result = await unicode(vm, arg);
                break;
            default: throw E.internal(`${this.name} is not a valid method command`);
        }
        if (typeof result === "number") {
            vm.getValue("RESULT").set(vm, result, [0]);
        }
        else {
            vm.getValue("RESULTS").set(vm, result, [0]);
        }
        return null;
    }
}
