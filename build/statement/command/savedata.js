import * as assert from "../../assert";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Dim from "../../property/dim";
import { savefile } from "../../savedata";
import Int0DValue from "../../value/int-0d";
import Int1DValue from "../../value/int-1d";
import Int2DValue from "../../value/int-2d";
import Int3DValue from "../../value/int-3d";
import IntChar0DValue from "../../value/int-char-0d";
import IntChar1DValue from "../../value/int-char-1d";
import Str0DValue from "../../value/str-0d";
import Str1DValue from "../../value/str-1d";
import StrChar0DValue from "../../value/str-char-0d";
import StrChar1DValue from "../../value/str-char-1d";
import Statement from "../index";
/* eslint-disable array-element-newline */
export const whitelist = [
    "DAY", "MONEY", "ITEM", "FLAG", "TFLAG", "UP", "PALAMLV", "EXPLV", "EJAC",
    "DOWN", "RESULT", "COUNT", "TARGET", "ASSI", "MASTER", "NOITEM", "LOSEBASE",
    "SELECTCOM", "PREVCOM", "TIME", "ITEMSALES", "PLAYER", "NEXTCOM", "PBAND",
    "BOUGHT",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
    "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "RANDDATA",
    "SAVESTR",
    "TSTR",
    "ISASSI", "NO",
    "BASE", "MAXBASE", "ABL", "TALENT", "EXP", "MARK", "PALAM", "SOURCE", "EX",
    "CFLAG", "JUEL", "RELATION", "EQUIP", "TEQUIP", "STAIN", "GOTJUEL", "NOWEX",
    "DOWNBASE", "CUP", "CDOWN", "TCVAR",
    "NAME", "CALLNAME", "NICKNAME", "MASTERNAME",
    "CSTR",
    // "CDFLAG",
    "DITEMTYPE", "DA", "DB", "DC", "DD", "DE",
    "TA", "TB",
];
/* eslint-enable array-element-newline */
const PARSER = U.arg2R2(X.expr, X.expr);
export default class SaveData extends Statement {
    arg;
    constructor(raw) {
        super(raw);
        this.arg = new Lazy(raw, PARSER);
    }
    async *run(vm) {
        const [indexExpr, commentExpr] = this.arg.get();
        const index = await indexExpr.reduce(vm);
        assert.bigint(index, "1st argument of SAVEDATA must be a number");
        const comment = await commentExpr.reduce(vm);
        assert.string(comment, "2nd argument of SAVEDATA must be a string");
        const saveData = {
            code: vm.code.csv.gamebase.code ?? 0,
            version: vm.code.csv.gamebase.version ?? 0,
            data: {
                comment,
                characters: [],
                variables: {},
            },
        };
        for (let i = 0; i < vm.characterList.length; ++i) {
            saveData.data.characters.push({});
        }
        const nameList = [...whitelist];
        for (const property of vm.code.header) {
            if (property instanceof Dim && property.isSave() && !property.isGlobal()) {
                nameList.push(property.name);
            }
        }
        for (const name of nameList) {
            const cell = vm.getValue(name);
            if (cell instanceof Int0DValue) {
                saveData.data.variables[name] = cell.value.toString();
            }
            else if (cell instanceof Int1DValue) {
                saveData.data.variables[name] = cell.value.map((value) => value.toString());
            }
            else if (cell instanceof Int2DValue) {
                saveData.data.variables[name] = cell.value.map((value0) => value0.map((value1) => value1.toString()));
            }
            else if (cell instanceof Int3DValue) {
                saveData.data.variables[name] = cell.value.map((value0) => value0.map((value1) => value1.map((value2) => value2.toString())));
            }
            else if (cell instanceof Str0DValue || cell instanceof Str1DValue) {
                saveData.data.variables[name] = cell.value;
            }
            else if (cell instanceof IntChar0DValue) {
                for (let i = 0; i < vm.characterList.length; ++i) {
                    const characterCell = vm.characterList[i].getValue(name);
                    saveData.data.characters[i][name] = characterCell.value.toString();
                }
            }
            else if (cell instanceof IntChar1DValue) {
                for (let i = 0; i < vm.characterList.length; ++i) {
                    const characterCell = vm.characterList[i].getValue(name);
                    saveData.data.characters[i][name] = characterCell.value.map((value) => value.toString());
                }
            }
            else if (cell instanceof StrChar0DValue || cell instanceof StrChar1DValue) {
                for (let i = 0; i < vm.characterList.length; ++i) {
                    const characterCell = vm.characterList[i].getValue(name);
                    saveData.data.characters[i][name] = characterCell.value;
                }
            }
        }
        await vm.external.setSavedata(savefile.game(Number(index)), JSON.stringify(saveData));
        return null;
    }
}
