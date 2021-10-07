import { assertNumber } from "../assert";
export default function parse(values) {
    const base = values.get("GAMEBASE.CSV");
    const result = {};
    for (const row of base ?? []) {
        switch (row[0]) {
            case "作者":
                result.author = row[1];
                break;
            case "追加情報":
                result.info = row[1];
                break;
            case "製作年":
                result.year = row[1];
                break;
            case "タイトル":
                result.title = row[1];
                break;
            case "バージョン": {
                const version = parseInt(row[1]);
                assertNumber(version, "Version in GAMEBASE.CSV should be an integer");
                result.version = version;
                break;
            }
            default: break;
        }
    }
    return result;
}
