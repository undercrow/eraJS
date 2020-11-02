import {assert, assertNumber} from "../assert";
import type {Character, Config} from "../config";

export default function parse(values: Map<string, string[][]>): Config["character"] {
	const result = new Map<number, Character>();
	for (const [fileName, rowList] of values) {
		if (!/^CHARA\d+\.CSV$/.test(fileName)) {
			continue;
		}

		const character: Partial<Character> = {
			talent: Array<number>(1000).fill(0),
			maxBase: Array<number>(100).fill(0),
			base: Array<number>(100).fill(0),
			abilities: Array<number>(100).fill(0),
			exp: Array<number>(100).fill(0),
			flags: Array<number>(1000).fill(0),
			cstr: Array<string>(100).fill(""),
			mark: Array<number>(100).fill(0),
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
					character.nickname = row[1];
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
						value = 0;
					}
					assertNumber(value, `Base value in ${fileName} should be an integer`);
					character.maxBase![index] = value;
					character.base![index] = value;
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
						value = 0;
					}
					assertNumber(value, `Ability value in ${fileName} should be an integer`);
					character.abilities![index] = value;
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
						value = 0;
					}
					assertNumber(value, `Talent value in ${fileName} should be an integer`);
					character.talent![index] = value;
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
						value = 0;
					}
					assertNumber(value, `Exp value in ${fileName} should be an integer`);
					character.exp![index] = value;
					break;
				}
				// case "相性":
				// case "助手":
				case "フラグ": {
					const index = parseInt(row[1]);
					assertNumber(index, `Flag index in ${fileName} should be an integer`);
					const value = parseInt(row[2]);
					assertNumber(value, `Flag value in ${fileName} should be an integer`);
					character.flags![index] = value;
					break;
				}
				case "CSTR": {
					const index = parseInt(row[1]);
					assertNumber(index, `Flag index in ${fileName} should be an integer`);
					const value = row[2];
					character.cstr![index] = value;
					break;
				}
			}
		}

		assert(character.id != null, `ID should be defined in ${fileName}`);
		assert(character.name != null, `Name should be defined in ${fileName}`);
		assert(character.nickname != null, `Nickname should be defined in ${fileName}`);

		result.set(character.id, character as Character);
	}

	return result;
}
