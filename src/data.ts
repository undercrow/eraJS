import * as Papa from "papaparse";

import parseAbility from "./csv/abl";
import parseBase from "./csv/base";
import parseCharacter from "./csv/character";
import parseExp from "./csv/exp";
import parseItem from "./csv/item";
import parseMark from "./csv/mark";
import parsePalam from "./csv/palam";
import parseStr from "./csv/str";
import parseTalent from "./csv/talent";
import parseTrain from "./csv/train";
import parseVarSize from "./csv/varsize";

export type Template = {
	id: number;
	name: string;
	callname: string;
	nickname: string;
	mastername: string;
	talent: Map<number, number>,
	maxBase: Map<number, number>;
	base: Map<number, number>;
	abilities: Map<number, number>;
	exp: Map<number, number>;
	flags: Map<number, number>;
	cstr: Map<number, string>;
	mark: Map<number, number>;
	palam: Map<number, number>;
	juel: Map<number, number>;
};

export type Data = {
	gamebase: {
		author?: string;
		info?: string;
		year?: string;
		title?: string;
		version?: number;
	};
	character: Map<number, Template>;
	ability: Map<number, string>;
	exp: Map<number, string>;
	item: Map<number, {name: string; price: number}>;
	talent: Map<number, string>;
	mark: Map<number, string>;
	palam: Map<number, string>;
	train: Map<number, string>;
	str: Map<number, string>;
	varSize: Map<string, number>;
};

export default function parseCSV(content: Map<string, string>): Data {
	const values = new Map<string, string[][]>();
	for (const [fileName, raw] of content) {
		const normalized = raw.replace(/\r/g, "").split("\n");
		const stripped = normalized.map((line) => /^[^;]*/.exec(line)![0]);
		const filtered = stripped.map((line) => line.trim()).filter((line) => line.length > 0);
		const parsed = Papa.parse<string[]>(filtered.join("\n"), {
			delimiter: ",",
			skipEmptyLines: true,
		});
		values.set(fileName.toUpperCase(), parsed.data);
	}

	return {
		gamebase: parseBase(values),
		character: parseCharacter(values),
		ability: parseAbility(values),
		exp: parseExp(values),
		item: parseItem(values),
		talent: parseTalent(values),
		mark: parseMark(values),
		palam: parsePalam(values),
		train: parseTrain(values),
		str: parseStr(values),
		varSize: parseVarSize(values),
	};
}
