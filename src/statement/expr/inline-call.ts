import {assert} from "../../assert";
import type VM from "../../vm";
import type Expr from "../expr";
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
import max from "../method/max";
import min from "../method/min";
import rand from "../method/rand";
import sign from "../method/sign";
import strLenS from "../method/strlens";
import toStr from "../method/tostr";
import varSize from "../method/varsize";
import unicode from "../method/unicode";

function runGenerator<T>(gen: Generator<any, T, any>): T {
	while (true) {
		const value = gen.next();
		if (value.done === true) {
			return value.value;
		}
	}
}

export default class InlineCall implements Expr {
	public name: string;
	public arg: Expr[];

	public constructor(name: string, arg: Expr[]) {
		this.name = name.toUpperCase();
		this.arg = arg;
	}

	public reduce(vm: VM): string | number {
		const arg: Array<string | number> = this.arg.map((a) => a.reduce(vm));
		switch (this.name.toUpperCase()) {
			case "ABS": return abs(vm, arg);
			case "BARSTR": return barStr(vm, arg);
			case "CSVABL": return csvAbl(vm, arg);
			case "CSVBASE": return csvBase(vm, arg);
			case "CSVCALLNAME": return csvCallname(vm, arg);
			case "CSVCFLAG": return csvCflag(vm, arg);
			case "CSVCSTR": return csvCstr(vm, arg);
			case "CSVEQUIP": return csvEquip(vm, arg);
			case "CSVEXP": return csvExp(vm, arg);
			case "CSVJUEL": return csvJuel(vm, arg);
			case "CSVMARK": return csvMark(vm, arg);
			case "CSVMASTERNAME": return csvMastername(vm, arg);
			case "CSVNAME": return csvName(vm, arg);
			case "CSVNICKNAME": return csvNickname(vm, arg);
			case "CSVRELATION": return csvRelation(vm, arg);
			case "CSVTALENT": return csvTalent(vm, arg);
			case "GETBGCOLOR": return getBgColor(vm, arg);
			case "GETBIT": return getBit(vm, arg);
			case "GETCHARA": return getChara(vm, arg);
			case "GETCOLOR": return getColor(vm, arg);
			case "GETDEFBGCOLOR": return getDefBgColor(vm, arg);
			case "GETDEFCOLOR": return getDefColor(vm, arg);
			case "GETFOCUSCOLOR": return getFocusColor(vm, arg);
			case "GROUPMATCH": return groupMatch(vm, arg);
			case "INRANGE": return inRange(vm, arg);
			case "LIMIT": return limit(vm, arg);
			case "MAX": return max(vm, arg);
			case "MIN": return min(vm, arg);
			case "RAND": return rand(vm, arg);
			case "SIGN": return sign(vm, arg);
			case "STRLENS": return strLenS(vm, arg);
			case "TOSTR": return toStr(vm, arg);
			case "VARSIZE": return varSize(vm, arg);
			case "UNICODE": return unicode(vm, arg);
			default: {
				assert(vm.fnMap.has(this.name), `Method ${this.name} does not exist`);
				for (const fn of vm.fnMap.get(this.name)!) {
					const result = runGenerator(fn.run(vm, arg));
					assert(result?.type === "return", "Inline call should return a value");
					return result.value[0];
				}
			}
		}
		throw new Error(`Inline call to ${this.name} is not implemented yet`);
	}
}
