import * as Papa from "papaparse";

import * as assert from "../assert";
import parseCharacter, {Template} from "./character";
import parseGamebase from "./gamebase";
import parseItem from "./item";
import parseVarSize from "./varsize";

export type Csv = {
	gamebase: ReturnType<typeof parseGamebase>;
	character: Map<number, Template>;
	abl: Map<number, string>;
	exp: Map<number, string>;
	talent: Map<number, string>;
	palam: Map<number, string>;
	train: Map<number, string>;
	mark: Map<number, string>;
	item: ReturnType<typeof parseItem>;
	base: Map<number, string>;
	source: Map<number, string>;
	ex: Map<number, string>;
	str: Map<number, string>;
	equip: Map<number, string>;
	tequip: Map<number, string>;
	flag: Map<number, string>;
	tflag: Map<number, string>;
	cflag: Map<number, string>;
	tcvar: Map<number, string>;
	cstr: Map<number, string>;
	stain: Map<number, string>;
	cdflag1: Map<number, string>;
	cdflag2: Map<number, string>;
	strName: Map<number, string>;
	tstr: Map<number, string>;
	saveStr: Map<number, string>;
	global: Map<number, string>;
	globalS: Map<number, string>;
	varSize: ReturnType<typeof parseVarSize>;
};

function parseStringMap(fileName: string, rows: string[][]): Map<number, string> {
	const result = new Map<number, string>();
	for (const row of rows) {
		const index = parseInt(row[0]);
		assert.number(index, `Index value in ${fileName} should be an integer`);
		result.set(index, row[1] ?? "");
	}

	return result;
}

export default function parseCSV(content: Map<string, string>): Csv {
	function getTable(name: string) {
		if (!content.has(name)) {
			return [];
		}

		const raw = content.get(name)!;
		const normalized = raw.replace(/\r/g, "").split("\n");
		const stripped = normalized.map((line) => /^[^;]*/.exec(line)![0]);
		const filtered = stripped.map((line) => line.trim()).filter((line) => line.length > 0);
		const parsed = Papa.parse<string[]>(filtered.join("\n"), {
			delimiter: ",",
			skipEmptyLines: true,
		});
		return parsed.data;
	}

	const gamebase = parseGamebase("GAMEBASE.CSV", getTable("GAMEBASE.CSV"));
	const abl = parseStringMap("ABL.CSV", getTable("ABL.CSV"));
	const exp = parseStringMap("EXP.CSV", getTable("EXP.CSV"));
	const talent = parseStringMap("TALENT.CSV", getTable("TALENT.CSV"));
	const palam = parseStringMap("PALAM.CSV", getTable("PALAM.CSV"));
	const train = parseStringMap("TRAIN.CSV", getTable("TRAIN.CSV"));
	const mark = parseStringMap("MARK.CSV", getTable("MARK.CSV"));
	const item = parseItem("ITEM.CSV", getTable("ITEM.CSV"));
	const base = parseStringMap("BASE.CSV", getTable("BASE.CSV"));
	const source = parseStringMap("SOURCE.CSV", getTable("SOURCE.CSV"));
	const ex = parseStringMap("EX.CSV", getTable("EX.CSV"));
	const str = parseStringMap("STR.CSV", getTable("STR.CSV"));
	const equip = parseStringMap("EQUIP.CSV", getTable("EQUIP.CSV"));
	const tequip = parseStringMap("TEQUIP.CSV", getTable("TEQUIP.CSV"));
	const flag = parseStringMap("FLAG.CSV", getTable("FLAG.CSV"));
	const tflag = parseStringMap("TFLAG.CSV", getTable("TFLAG.CSV"));
	const cflag = parseStringMap("CFLAG.CSV", getTable("CFLAG.CSV"));
	const tcvar = parseStringMap("TCVAR.CSV", getTable("TCVAR.CSV"));
	const cstr = parseStringMap("CSTR.CSV", getTable("CSTR.CSV"));
	const stain = parseStringMap("STAIN.CSV", getTable("STAIN.CSV"));
	const cdflag1 = parseStringMap("CDFLAG1.CSV", getTable("CDFLAG1.CSV"));
	const cdflag2 = parseStringMap("CDFLAG2.CSV", getTable("CDFLAG2.CSV"));
	const strName = parseStringMap("STRNAME.CSV", getTable("STRNAME.CSV"));
	const tstr = parseStringMap("TSTR.CSV", getTable("TSTR.CSV"));
	const saveStr = parseStringMap("SAVESTR.CSV", getTable("SAVESTR.CSV"));
	const global = parseStringMap("GLOBAL.CSV", getTable("GLOBAL.CSV"));
	const globalS = parseStringMap("GLOBALS.CSV", getTable("GLOBALS.CSV"));

	const varSize = parseVarSize("VARIABLESIZE.CSV", getTable("VARIABLESIZE.CSV"));
	const character = new Map<number, Template>();
	for (const name of content.keys()) {
		if (name.startsWith("CHARA") && name.endsWith(".CSV")) {
			const template = parseCharacter(name, getTable(name), {
				base: new Map([...base.entries()].map(([index, value]) => [value, index])),
				mark: new Map([...mark.entries()].map(([index, value]) => [value, index])),
				exp: new Map([...exp.entries()].map(([index, value]) => [value, index])),
				abl: new Map([...abl.entries()].map(([index, value]) => [value, index])),
				talent: new Map([...talent.entries()].map(([index, value]) => [value, index])),
				cflag: new Map([...cflag.entries()].map(([index, value]) => [value, index])),
				equip: new Map([...equip.entries()].map(([index, value]) => [value, index])),
				juel: new Map([...palam.entries()].map(([index, value]) => [value, index])),
				cstr: new Map([...cstr.entries()].map(([index, value]) => [value, index])),
			});
			character.set(template.no, template);
		}
	}
	// TODO: RelationDic

	return {
		gamebase,
		character,
		abl,
		exp,
		talent,
		palam,
		train,
		mark,
		item,
		base,
		source,
		ex,
		str,
		equip,
		tequip,
		flag,
		tflag,
		cflag,
		tcvar,
		cstr,
		stain,
		cdflag1,
		cdflag2,
		strName,
		tstr,
		saveStr,
		global,
		globalS,
		varSize,
	};
}
