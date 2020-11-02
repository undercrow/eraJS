import * as Papa from "papaparse";

import parseAbility from "./csv/abl";
import parseBase from "./csv/base";
import parseCharacter from "./csv/character";
import parseExp from "./csv/exp";
import parseMark from "./csv/mark";
import parsePalam from "./csv/palam";
import parseTalent from "./csv/talent";

export type Character = {
	id: number;
	name: string;
	nickname: string;
	talent: number[];
	maxBase: number[];
	base: number[];
	abilities: number[];
	exp: number[];
	flags: number[];
	cstr: string[];
	mark: number[];
	palam: number[];
};

export type Config = {
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
	talent: string[];
	mark: string[];
	palam: string[];
};

export default function parseCSV(content: Map<string, string>): Config {
	const values = new Map<string, string[][]>();
	for (const [fileName, raw] of content) {
		const normalized = raw.replace(/\r/g, "");
		const stripped = normalized.split("\n").map((line) => /^[^;]*/.exec(line)![0]).join("\n");
		const parsed = Papa.parse<string[]>(stripped, {
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
		talent: parseTalent(values),
		mark: parseMark(values),
		palam: parsePalam(values),
	};
}
