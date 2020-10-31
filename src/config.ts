import * as Papa from "papaparse";

import parseBase from "./csv/base";
import parseCharacter from "./csv/character";

export type Character = {
	id: number;
	name: string;
	nickname: string;
	talent: number[];
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
};

export default function parseCSV(content: Map<string, string>): Config {
	const values = new Map<string, string[][]>();
	for (const [fileName, raw] of content) {
		const parsed = Papa.parse<string[]>(raw, {
			delimiter: ",",
		});
		values.set(fileName.toUpperCase(), parsed.data);
	}

	return {
		gamebase: parseBase(values),
		character: parseCharacter(values),
	};
}
