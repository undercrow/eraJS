import * as Papa from "papaparse";

import parseAbility from "./csv/abl";
import parseBase from "./csv/base";
import parseCharacter from "./csv/character";
import parseTalent from "./csv/talent";

export type Character = {
	id: number;
	name: string;
	nickname: string;
	talent: number[];
	abilities: number[];
	exp: number[];
	flags: number[];
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
	talent: string[];
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
		talent: parseTalent(values),
	};
}
