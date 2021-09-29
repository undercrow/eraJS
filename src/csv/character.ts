import {assert, assertNumber} from "../assert";
import type {Template, Data} from "../data";

export default function parse(values: Map<string, string[][]>): Data["character"] {
	const result = new Map<number, Template>();
	for (const [fileName, rowList] of values) {
		if (!/^CHARA\d+\.CSV$/.test(fileName)) {
			continue;
		}

		const template: Partial<Template> = {
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
					template.id = id;
					break;
				}
				case "名前": {
					template.name = row[1];
					break;
				}
				case "呼び名": {
					template.callname = row[1];
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
					template.maxBase!.set(index, value);
					template.base!.set(index, value);
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
					template.abilities!.set(index, value);
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
					template.talent!.set(index, value);
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
					template.exp!.set(index, value);
					break;
				}
				// case "相性":
				// case "助手":
				case "フラグ": {
					const index = parseInt(row[1]);
					assertNumber(index, `Flag index in ${fileName} should be an integer`);
					const value = parseInt(row[2]);
					assertNumber(value, `Flag value in ${fileName} should be an integer`);
					template.flags!.set(index, value);
					break;
				}
				case "あだ名": {
					template.nickname = row[1];
					break;
				}
				case "主人の呼び方": {
					template.mastername = row[1];
					break;
				}
				case "CSTR": {
					const index = parseInt(row[1]);
					assertNumber(index, `Flag index in ${fileName} should be an integer`);
					const value = row[2];
					template.cstr!.set(index, value);
					break;
				}
			}
		}

		assert(template.id != null, `ID should be defined in ${fileName}`);
		if (template.name == null) { template.name = ""; }
		if (template.callname == null) { template.callname = ""; }
		if (template.nickname == null) { template.nickname = ""; }
		if (template.mastername == null) { template.mastername = ""; }

		result.set(template.id, template as Template);
	}

	return result;
}
