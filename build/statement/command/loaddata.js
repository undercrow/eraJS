import * as assert from "../../assert";
import Character from "../../character";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import { savefile } from "../../savedata";
import Lazy from "../../lazy";
import Int0DValue from "../../value/int-0d";
import Int1DValue from "../../value/int-1d";
import Int2DValue from "../../value/int-2d";
import Str0DValue from "../../value/str-0d";
import Str1DValue from "../../value/str-1d";
import Statement from "../index";
const PARSER = U.arg1R1(E.expr);
export default class LoadData extends Statement {
    arg;
    constructor(arg) {
        super();
        this.arg = new Lazy(arg, PARSER);
    }
    *run(vm) {
        const index = this.arg.get().reduce(vm);
        assert.number(index, "Argument of LOADDATA must be a number");
        const file = savefile.game(index);
        const raw = vm.external.getSavedata(file);
        assert.nonNull(raw, `Save file ${file} does not exist`);
        try {
            const parsed = JSON.parse(raw);
            assert.string(parsed.data.comment, "");
            assert.array(parsed.data.characters, "");
            const newCharacters = [];
            for (const character of parsed.data.characters) {
                const newCharacter = new Character(vm, {
                    id: 0,
                    name: "",
                    callname: "",
                    nickname: "",
                    mastername: "",
                    talent: new Map(),
                    maxBase: new Map(),
                    base: new Map(),
                    abilities: new Map(),
                    exp: new Map(),
                    flags: new Map(),
                    cstr: new Map(),
                    mark: new Map(),
                    juel: new Map(),
                });
                for (const [name, value] of Object.entries(character)) {
                    const cell = newCharacter.getValue(name);
                    if (cell instanceof Int0DValue) {
                        assert.number(value, "");
                        cell.reset(value);
                    }
                    else if (cell instanceof Int1DValue) {
                        assert.numArray(value, "");
                        cell.reset(value);
                    }
                    else if (cell instanceof Str0DValue) {
                        assert.string(value, "");
                        cell.reset(value);
                    }
                    else if (cell instanceof Str1DValue) {
                        assert.strArray(value, "");
                        cell.reset(value);
                    }
                }
            }
            vm.characterList = newCharacters;
            vm.getValue("CHARANUM").set(vm, newCharacters.length, []);
            for (const [name, value] of Object.entries(parsed.data.variables)) {
                const cell = vm.getValue(name);
                if (cell instanceof Int0DValue) {
                    assert.number(value, "");
                    cell.reset(value);
                }
                else if (cell instanceof Int1DValue) {
                    assert.numArray(value, "");
                    cell.reset(value);
                }
                else if (cell instanceof Int2DValue) {
                    assert.numArray2D(value, "");
                    cell.reset(value);
                }
                else if (cell instanceof Str0DValue) {
                    assert.string(value, "");
                    cell.reset(value);
                }
                else if (cell instanceof Str1DValue) {
                    assert.strArray(value, "");
                    cell.reset(value);
                }
                else {
                    throw new Error("");
                }
            }
        }
        catch {
            throw new Error(`Save file ${file} is not in a valid format`);
        }
        return null;
    }
}