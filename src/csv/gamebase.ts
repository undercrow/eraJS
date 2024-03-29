import * as assert from "../assert";

type GameBase = {
	author?: string;
	info?: string;
	year?: string;
	title?: string;
	code?: number;
	version?: number;
};

export default function parse(fileName: string, rows: string[][]): GameBase {
	const result: GameBase = {};
	for (const row of rows) {
		switch (row[0]) {
			case "作者": result.author = row[1]; break;
			case "追加情報": result.info = row[1]; break;
			case "製作年": result.year = row[1]; break;
			case "タイトル": result.title = row[1]; break;
			case "コード": {
				const code = parseInt(row[1]);
				assert.number(code, `Code in ${fileName} should be an integer`);
				result.code = code;
				break;
			}
			case "バージョン": {
				const version = parseInt(row[1]);
				assert.number(version, `Version in ${fileName} should be an integer`);
				result.version = version;
				break;
			}
			default: break;
		}
	}

	return result;
}
