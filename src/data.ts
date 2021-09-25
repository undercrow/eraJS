import * as Papa from "papaparse";

import parseAbility from "./csv/abl";
import parseBase from "./csv/base";
import parseCharacter from "./csv/character";
import parseExp from "./csv/exp";
import parseItem from "./csv/item";
import parseMark from "./csv/mark";
import parsePalam from "./csv/palam";
import parseTalent from "./csv/talent";
import parseTrain from "./csv/train";

export type Character = {
	id: number;
	name: string;
	callname: string;
	nickname: string;
	mastername: string;
	talent: number[];
	maxBase: number[];
	base: number[];
	abilities: number[];
	exp: number[];
	flags: number[];
	cstr: string[];
	mark: number[];
	palam: number[];
	juel: number[];
};

export type Data = {
	gamebase: {
		author?: string;
		info?: string;
		year?: string;
		title?: string;
		version?: number;
	};
	character: Map<number, Character>;
	ability: string[];
	exp: string[];
	item: string[];
	talent: string[];
	mark: string[];
	palam: string[];
	train: string[];
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
	};
}
