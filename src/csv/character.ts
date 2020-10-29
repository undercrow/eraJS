import {assert, assertNumber} from "../assert";
import type {Character, Config} from "../config";

export default function parse(values: Map<string, string[][]>): Config["character"] {
	const result = new Map<number, Character>();
	for (const [fileName, rowList] of values) {
		if (!/^CHARA\d+\.CSV$/.test(fileName)) {
			continue;
		}

		const character: Partial<Character> = {
			flags: new Map(),
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
				// TODO
				// case "基礎":
				// case "能力":
				// case "素質":
				// case "経験":
				// case "相性":
				// case "助手":
				case "フラグ": {
					const index = parseInt(row[1]);
					assertNumber(index, `Flag index in ${fileName} should be an integer`);
					const value = parseInt(row[2]);
					assertNumber(value, `Flag value in ${fileName} should be an integer`);
					character.flags!.set(index, value);
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
