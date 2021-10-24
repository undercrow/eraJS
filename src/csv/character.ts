import * as assert from "../assert";
import type {Template, Data} from "../data";

export default function parse(values: Map<string, string[][]>): Data["character"] {
	const result = new Map<number, Template>();
	for (const [fileName, rowList] of values) {
		if (!/^CHARA\d+\.CSV$/.test(fileName)) {
			continue;
		}

		const template: Partial<Template> = {
			base: new Map(),
			maxBase: new Map(),
			mark: new Map(),
			exp: new Map(),
			abl: new Map(),
			talent: new Map(),
			relation: new Map(),
			cflag: new Map(),
			equip: new Map(),
			juel: new Map(),
			cstr: new Map(),
		};
		for (const row of rowList) {
			switch (row[0]) {
				case "番号": {
					const no = parseInt(row[1]);
					assert.number(no, `NO in ${fileName} should be an integer`);
					template.no = no;
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
				case "あだ名": {
					template.nickname = row[1];
					break;
				}
				case "主人の呼び方": {
					template.mastername = row[1];
					break;
				}
				case "基礎": {
					const index = parseInt(row[1]);
					assert.number(index, `Base index in ${fileName} should be an integer`);
					let value: number;
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					if (row[2] != null && row[2] !== "") {
						value = parseInt(row[2]);
					} else {
						value = 1;
					}
					assert.number(value, `Base value in ${fileName} should be an integer`);
					template.base!.set(index, value);
					template.maxBase!.set(index, value);
					break;
				}
				case "刻印": {
					const index = parseInt(row[1]);
					assert.number(index, `Mark index in ${fileName} should be an integer`);
					let value: number;
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					if (row[2] != null && row[2] !== "") {
						value = parseInt(row[2]);
					} else {
						value = 1;
					}
					template.mark!.set(index, value);
					break;
				}
				case "経験": {
					const index = parseInt(row[1]);
					assert.number(index, `Exp index in ${fileName} should be an integer`);
					let value: number;
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					if (row[2] != null && row[2] !== "") {
						value = parseInt(row[2]);
					} else {
						value = 1;
					}
					assert.number(value, `Exp value in ${fileName} should be an integer`);
					template.exp!.set(index, value);
					break;
				}
				case "能力": {
					const index = parseInt(row[1]);
					assert.number(index, `Abl index in ${fileName} should be an integer`);
					let value: number;
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					if (row[2] != null && row[2] !== "") {
						value = parseInt(row[2]);
					} else {
						value = 1;
					}
					assert.number(value, `Abl value in ${fileName} should be an integer`);
					template.abl!.set(index, value);
					break;
				}
				case "素質": {
					const index = parseInt(row[1]);
					assert.number(index, `Talent index in ${fileName} should be an integer`);
					let value: number;
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					if (row[2] != null && row[2] !== "") {
						value = parseInt(row[2]);
					} else {
						value = 1;
					}
					assert.number(value, `Talent value in ${fileName} should be an integer`);
					template.talent!.set(index, value);
					break;
				}
				case "相性": {
					const index = parseInt(row[1]);
					assert.number(index, `Relation index in ${fileName} should be an integer`);
					let value: number;
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					if (row[2] != null && row[2] !== "") {
						value = parseInt(row[2]);
					} else {
						value = 1;
					}
					assert.number(value, `Relation value in ${fileName} should be an integer`);
					template.relation!.set(index, value);
					break;
				}
				case "フラグ": {
					const index = parseInt(row[1]);
					assert.number(index, `Flag index in ${fileName} should be an integer`);
					const value = parseInt(row[2]);
					assert.number(value, `Flag value in ${fileName} should be an integer`);
					template.cflag!.set(index, value);
					break;
				}
				case "装着物": {
					const index = parseInt(row[1]);
					assert.number(index, `Equip index in ${fileName} should be an integer`);
					let value: number;
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					if (row[2] != null && row[2] !== "") {
						value = parseInt(row[2]);
					} else {
						value = 1;
					}
					assert.number(value, `Equip value in ${fileName} should be an integer`);
					template.equip!.set(index, value);
					break;
				}
				case "珠": {
					const index = parseInt(row[1]);
					assert.number(index, `Juel index in ${fileName} should be an integer`);
					let value: number;
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					if (row[2] != null && row[2] !== "") {
						value = parseInt(row[2]);
					} else {
						value = 1;
					}
					assert.number(value, `Juel value in ${fileName} should be an integer`);
					template.juel!.set(index, value);
					break;
				}
				case "CSTR": {
					const index = parseInt(row[1]);
					assert.number(index, `Flag index in ${fileName} should be an integer`);
					const value = row[2];
					template.cstr!.set(index, value);
					break;
				}
			}
		}

		assert.cond(template.no != null, `ID should be defined in ${fileName}`);
		if (template.name == null) { template.name = ""; }
		if (template.callname == null) { template.callname = ""; }
		if (template.nickname == null) { template.nickname = ""; }
		if (template.mastername == null) { template.mastername = ""; }

		result.set(template.no, template as Template);
	}

	return result;
}
