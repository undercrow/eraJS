import {assert, assertNumber} from "../assert";
import type {Character, Data} from "../data";

export default function parse(values: Map<string, string[][]>): Data["character"] {
	const result = new Map<number, Character>();
	for (const [fileName, rowList] of values) {
		if (!/^CHARA\d+\.CSV$/.test(fileName)) {
			continue;
		}

		const character: Partial<Character> = {
			talent: new Map(),
			maxBase: new Map(),
			base: new Map(),
			abilities: new Map(),
			exp: new Map(),
			flags: new Map(),
			cstr: new Map(),
			mark: new Map(),
			palam: new Map(),
			juel: new Map(),
		};
		for (const row of rowList) {
			switch (row[0]) {
				case "番号": {
					const id = parseInt(row[1]);
					assertNumber(id, `ID in ${fileName} should be an integer`);
					character.id = id;
					break;
				}
				case "名前": {
					character.name = row[1];
					break;
				}
				case "呼び名": {
					character.callname = row[1];
					break;
				}
				case "基礎": {
					const index = parseInt(row[1]);
					assertNumber(index, `Base index in ${fileName} should be an integer`);
					let value: number;
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					if (row[2] != null && row[2] !== "") {
						value = parseInt(row[2]);
					} else {
						value = 1;
					}
					assertNumber(value, `Base value in ${fileName} should be an integer`);
					character.maxBase!.set(index, value);
					character.base!.set(index, value);
					break;
				}
				case "能力": {
					const index = parseInt(row[1]);
					assertNumber(index, `Ability index in ${fileName} should be an integer`);
					let value: number;
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					if (row[2] != null && row[2] !== "") {
						value = parseInt(row[2]);
					} else {
						value = 1;
					}
					assertNumber(value, `Ability value in ${fileName} should be an integer`);
					character.abilities!.set(index, value);
					break;
				}
				case "素質": {
					const index = parseInt(row[1]);
					assertNumber(index, `Talent index in ${fileName} should be an integer`);
					let value: number;
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					if (row[2] != null && row[2] !== "") {
						value = parseInt(row[2]);
					} else {
						value = 1;
					}
					assertNumber(value, `Talent value in ${fileName} should be an integer`);
					character.talent!.set(index, value);
					break;
				}
				case "経験": {
					const index = parseInt(row[1]);
					assertNumber(index, `Exp index in ${fileName} should be an integer`);
					let value: number;
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					if (row[2] != null && row[2] !== "") {
						value = parseInt(row[2]);
					} else {
						value = 1;
					}
					assertNumber(value, `Exp value in ${fileName} should be an integer`);
					character.exp!.set(index, value);
					break;
				}
				// case "相性":
				// case "助手":
				case "フラグ": {
					const index = parseInt(row[1]);
					assertNumber(index, `Flag index in ${fileName} should be an integer`);
					const value = parseInt(row[2]);
					assertNumber(value, `Flag value in ${fileName} should be an integer`);
					character.flags!.set(index, value);
					break;
				}
				case "あだ名": {
					character.nickname = row[1];
					break;
				}
				case "主人の呼び方": {
					character.mastername = row[1];
					break;
				}
				case "CSTR": {
					const index = parseInt(row[1]);
					assertNumber(index, `Flag index in ${fileName} should be an integer`);
					const value = row[2];
					character.cstr!.set(index, value);
					break;
				}
			}
		}

		assert(character.id != null, `ID should be defined in ${fileName}`);
		if (character.name == null) { character.name = ""; }
		if (character.callname == null) { character.callname = ""; }
		if (character.nickname == null) { character.nickname = ""; }
		if (character.mastername == null) { character.mastername = ""; }

		result.set(character.id, character as Character);
	}

	return result;
}
