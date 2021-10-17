import * as Papa from "papaparse";
import parseAbility from "./csv/abl";
import parseBase from "./csv/base";
import parseCharacter from "./csv/character";
import parseExp from "./csv/exp";
import parseItem from "./csv/item";
import parseMark from "./csv/mark";
import parsePalam from "./csv/palam";
import parseStr from "./csv/str";
import parseTalent from "./csv/talent";
import parseTrain from "./csv/train";
import parseVarSize from "./csv/varsize";
export default function parseCSV(content) {
    const values = new Map();
    for (const [fileName, raw] of content) {
        const normalized = raw.replace(/\r/g, "").split("\n");
        const stripped = normalized.map((line) => /^[^;]*/.exec(line)[0]);
        const filtered = stripped.map((line) => line.trim()).filter((line) => line.length > 0);
        const parsed = Papa.parse(filtered.join("\n"), {
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
        item: parseItem(values),
        talent: parseTalent(values),
        mark: parseMark(values),
        palam: parsePalam(values),
        train: parseTrain(values),
        str: parseStr(values),
        varSize: parseVarSize(values),
    };
}
