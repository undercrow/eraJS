import * as assert from "../../assert";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Dim from "../../property/dim";
import { savefile } from "../../savedata";
import Int0DValue from "../../value/int-0d";
import Int1DValue from "../../value/int-1d";
import Int2DValue from "../../value/int-2d";
import Int3DValue from "../../value/int-3d";
import Str0DValue from "../../value/str-0d";
import Str1DValue from "../../value/str-1d";
import Statement from "../index";
export const savedVariables = [
    "DOWNBASE",
    "CUP",
    "CDOWN",
    "TCVAR",
    "NICKNAME",
    "MASTERNAME",
    "CSTR",
    // "CDFLAG",
];
const PARSER = U.arg2R2(E.expr, E.expr);
export default class SaveData extends Statement {
    arg;
    constructor(arg) {
        super();
        this.arg = new Lazy(arg, PARSER);
    }
    *run(vm) {
        const [indexExpr, commentExpr] = this.arg.get();
        const index = indexExpr.reduce(vm);
        assert.number(index, "1st argument of SAVEDATA must be a number");
        const comment = commentExpr.reduce(vm);
        assert.string(comment, "2nd argument of SAVEDATA must be a string");
        const saveData = {
            code: vm.getValue("GAMEBASE_GAMECODE").get(vm, []),
            version: vm.getValue("GAMEBASE_VERSION").get(vm, []),
            data: {
                comment,
                characters: [],
                variables: {},
            },
        };
        for (const character of vm.characterList) {
            const characterData = {};
            for (const name of savedVariables) {
                const cell = character.getValue(name);
                if (cell instanceof Int0DValue) {
                    characterData[name] = cell.value;
                }
                else if (cell instanceof Int1DValue) {
                    characterData[name] = cell.value;
                }
                else if (cell instanceof Int2DValue) {
                    characterData[name] = cell.value;
                }
                else if (cell instanceof Str0DValue) {
                    characterData[name] = cell.value;
                }
                else if (cell instanceof Str1DValue) {
                    characterData[name] = cell.value;
                }
            }
            for (const property of vm.code.header) {
                if (property instanceof Dim && property.isChar() && property.isSave()) {
                    const cell = character.getValue(property.name);
                    if (cell instanceof Int0DValue) {
                        characterData[property.name] = cell.value;
                    }
                    else if (cell instanceof Int1DValue) {
                        characterData[property.name] = cell.value;
                    }
                    else if (cell instanceof Int2DValue) {
                        characterData[property.name] = cell.value;
                    }
                    else if (cell instanceof Str0DValue) {
                        characterData[property.name] = cell.value;
                    }
                    else if (cell instanceof Str1DValue) {
                        characterData[property.name] = cell.value;
                    }
                }
            }
            saveData.data.characters.push(characterData);
        }
        for (const property of vm.code.header) {
            if (property instanceof Dim && property.isSave() && !property.isGlobal()) {
                const cell = vm.getValue(property.name);
                if (cell instanceof Int0DValue) {
                    saveData.data.variables[property.name] = cell.value;
                }
                else if (cell instanceof Int1DValue) {
                    saveData.data.variables[property.name] = cell.value;
                }
                else if (cell instanceof Int2DValue) {
                    saveData.data.variables[property.name] = cell.value;
                }
                else if (cell instanceof Int3DValue) {
                    saveData.data.variables[property.name] = cell.value;
                }
                else if (cell instanceof Str0DValue) {
                    saveData.data.variables[property.name] = cell.value;
                }
                else if (cell instanceof Str1DValue) {
                    saveData.data.variables[property.name] = cell.value;
                }
            }
        }
        vm.external.setSavedata(savefile.game(index), JSON.stringify(saveData));
        return null;
    }
}
