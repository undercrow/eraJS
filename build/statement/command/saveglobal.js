import * as U from "../../erb/util";
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
    "GLOBAL",
    "GLOBALS",
    "RANDDATA",
    "TSTR",
    "DITEMTYPE",
    "DA",
    "DB",
    "DC",
    "DD",
    "DE",
    "TA",
    "TB",
];
const PARSER = U.arg0R0();
export default class SaveGlobal extends Statement {
    constructor(arg) {
        super();
        PARSER.tryParse(arg);
    }
    *run(vm) {
        const saveData = {
            code: vm.getValue("GAMEBASE_GAMECODE").get(vm, []),
            version: vm.getValue("GAMEBASE_VERSION").get(vm, []),
            data: {},
        };
        for (const name of savedVariables) {
            const cell = vm.getValue(name);
            if (cell instanceof Int0DValue) {
                saveData.data[name] = cell.value;
            }
            else if (cell instanceof Int1DValue) {
                saveData.data[name] = cell.value;
            }
            else if (cell instanceof Int2DValue) {
                saveData.data[name] = cell.value;
            }
            else if (cell instanceof Int3DValue) {
                saveData.data[name] = cell.value;
            }
            else if (cell instanceof Str0DValue) {
                saveData.data[name] = cell.value;
            }
            else if (cell instanceof Str1DValue) {
                saveData.data[name] = cell.value;
            }
        }
        for (const property of vm.code.header) {
            if (property instanceof Dim && property.isSave() && property.isGlobal()) {
                const cell = vm.getValue(property.name);
                if (cell instanceof Int0DValue) {
                    saveData.data[property.name] = cell.value;
                }
                else if (cell instanceof Int1DValue) {
                    saveData.data[property.name] = cell.value;
                }
                else if (cell instanceof Int2DValue) {
                    saveData.data[property.name] = cell.value;
                }
                else if (cell instanceof Int3DValue) {
                    saveData.data[property.name] = cell.value;
                }
                else if (cell instanceof Str0DValue) {
                    saveData.data[property.name] = cell.value;
                }
                else if (cell instanceof Str1DValue) {
                    saveData.data[property.name] = cell.value;
                }
            }
        }
        vm.external.setSavedata(savefile.global, JSON.stringify(saveData));
        return null;
    }
}
