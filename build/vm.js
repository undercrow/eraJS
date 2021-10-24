import * as color from "./color";
import EraJSError from "./error";
import * as E from "./error";
import Fn from "./fn";
import OutputQueue from "./output-queue";
import Define from "./property/define";
import Dim from "./property/dim";
import LocalSize from "./property/localsize";
import LocalSSize from "./property/localssize";
import PRNG from "./random";
import * as scene from "./scene";
import Thunk from "./thunk";
import Value from "./value";
import CharaNumValue from "./value/special/charanum";
import LineCountValue from "./value/special/linecount";
import RandValue from "./value/special/rand";
const EVENT = [
    "EVENTFIRST",
    "EVENTTRAIN",
    "EVENTSHOP",
    "EVENTBUY",
    "EVENTCOM",
    "EVENTTURNEND",
    "EVENTCOMEND",
    "EVENTEND",
    "EVENTLOAD",
];
export default class VM {
    random;
    code;
    external;
    eventMap;
    fnMap;
    macroMap;
    templateMap;
    globalMap;
    staticMap;
    characterList;
    contextStack;
    queue;
    alignment;
    font;
    color;
    printCPerLine;
    constructor(code) {
        this.random = new PRNG();
        this.code = code;
        this.eventMap = new Map();
        this.fnMap = new Map();
        this.macroMap = new Map();
        this.templateMap = new Map();
        this.globalMap = new Map();
        this.staticMap = new Map();
        this.characterList = [];
        this.contextStack = [];
        for (const fn of code.fnList) {
            if (EVENT.includes(fn.name)) {
                if (!this.eventMap.has(fn.name)) {
                    this.eventMap.set(fn.name, []);
                }
                this.eventMap.get(fn.name).push(fn);
            }
            else {
                this.fnMap.set(fn.name, fn);
            }
        }
        // Reorder functions
        for (const events of this.eventMap.values()) {
            events.sort((a, b) => {
                if (a.isFirst()) {
                    return -1;
                }
                if (b.isFirst()) {
                    return 1;
                }
                if (a.isLast()) {
                    return 1;
                }
                if (b.isLast()) {
                    return -1;
                }
                return 0;
            });
        }
        for (const property of code.header) {
            if (property instanceof Define) {
                this.macroMap.set(property.name, property);
            }
        }
        for (const [id, character] of code.data.character) {
            this.templateMap.set(id, character);
        }
        this.globalMap.set("GLOBAL", Value.Int1D(code.data, "GLOBAL"));
        this.globalMap.set("GLOBALS", Value.Int1D(code.data, "GLOBALS"));
        this.reset();
        // Push dummy context for outermost call
        this.pushContext(new Fn("@DUMMY", [], [], new Thunk([])));
    }
    reset() {
        this.queue = new OutputQueue();
        this.alignment = "LEFT";
        this.font = {
            name: "",
            bold: false,
            italic: false,
            strike: false,
            underline: false,
        };
        this.printCPerLine = 3; // TODO
        // Assign default colors
        this.color = {
            defaultFront: color.hex(0xFFFFFF),
            defaultBack: color.hex(0x000000),
            front: color.hex(0xFFFFFF),
            back: color.hex(0x000000),
            focus: color.hex(0xFFFF00),
        };
        const { header, data } = this.code;
        this.globalMap.set("DAY", Value.Int1D(data, "DAY"));
        this.globalMap.set("MONEY", Value.Int1D(data, "MONEY"));
        this.globalMap.set("ITEM", Value.Int1D(data, "ITEM"));
        this.globalMap.set("FLAG", Value.Int1D(data, "FLAG", 10000));
        this.globalMap.set("TFLAG", Value.Int1D(data, "TFLAG"));
        this.globalMap.set("UP", Value.Int1D(data, "UP"));
        this.globalMap.set("PALAMLV", Value.Int1D(data, "PALAMLV").reset([0, 100, 500, 3000, 10000, 30000, 60000, 100000, 150000, 250000]));
        this.globalMap.set("EXPLV", Value.Int1D(data, "EXPLV").reset([0, 1, 4, 20, 50, 200]));
        this.globalMap.set("EJAC", Value.Int1D(data, "EJAC").reset([10000]));
        this.globalMap.set("DOWN", Value.Int1D(data, "DOWN"));
        this.globalMap.set("RESULT", Value.Int1D(data, "RESULT"));
        this.globalMap.set("COUNT", Value.Int1D(data, "COUNT"));
        this.globalMap.set("TARGET", Value.Int1D(data, "TARGET").reset([1]));
        this.globalMap.set("ASSI", Value.Int1D(data, "ASSI").reset([-1]));
        this.globalMap.set("MASTER", Value.Int1D(data, "MASTER"));
        this.globalMap.set("NOITEM", Value.Int1D(data, "NOITEM"));
        this.globalMap.set("LOSEBASE", Value.Int1D(data, "LOSEBASE"));
        this.globalMap.set("SELECTCOM", Value.Int1D(data, "SELECTCOM"));
        this.globalMap.set("ASSIPLAY", Value.Int1D(data, "ASSIPLAY"));
        this.globalMap.set("PREVCOM", Value.Int1D(data, "PREVCOM").reset([-1]));
        this.globalMap.set("TIME", Value.Int1D(data, "TIME"));
        this.globalMap.set("ITEMSALES", Value.Int1D(data, "ITEMSALES"));
        this.globalMap.set("PLAYER", Value.Int1D(data, "PLAYER"));
        this.globalMap.set("NEXTCOM", Value.Int1D(data, "NEXTCOM").reset([-1]));
        this.globalMap.set("PBAND", Value.Int1D(data, "PBAND").reset([4]));
        this.globalMap.set("BOUGHT", Value.Int1D(data, "BOUGHT"));
        this.globalMap.set("A", Value.Int1D(data, "A"));
        this.globalMap.set("B", Value.Int1D(data, "B"));
        this.globalMap.set("C", Value.Int1D(data, "C"));
        this.globalMap.set("D", Value.Int1D(data, "D"));
        this.globalMap.set("E", Value.Int1D(data, "E"));
        this.globalMap.set("F", Value.Int1D(data, "F"));
        this.globalMap.set("G", Value.Int1D(data, "G"));
        this.globalMap.set("H", Value.Int1D(data, "H"));
        this.globalMap.set("I", Value.Int1D(data, "I"));
        this.globalMap.set("J", Value.Int1D(data, "J"));
        this.globalMap.set("K", Value.Int1D(data, "K"));
        this.globalMap.set("L", Value.Int1D(data, "L"));
        this.globalMap.set("M", Value.Int1D(data, "M"));
        this.globalMap.set("N", Value.Int1D(data, "N"));
        this.globalMap.set("O", Value.Int1D(data, "O"));
        this.globalMap.set("P", Value.Int1D(data, "P"));
        this.globalMap.set("Q", Value.Int1D(data, "Q"));
        this.globalMap.set("R", Value.Int1D(data, "R"));
        this.globalMap.set("S", Value.Int1D(data, "S"));
        this.globalMap.set("T", Value.Int1D(data, "T"));
        this.globalMap.set("U", Value.Int1D(data, "U"));
        this.globalMap.set("V", Value.Int1D(data, "V"));
        this.globalMap.set("W", Value.Int1D(data, "W"));
        this.globalMap.set("X", Value.Int1D(data, "X"));
        this.globalMap.set("Y", Value.Int1D(data, "Y"));
        this.globalMap.set("Z", Value.Int1D(data, "Z"));
        this.globalMap.set("ITEMPRICE", Value.Int1D(data, "ITEMPRICE").reset(new Map([...data.item.entries()].map(([key, val]) => [key, val.price]))));
        this.globalMap.set("RANDDATA", Value.Int1D(data, "RANDDATA").reset([this.random.state]));
        this.globalMap.set("SAVESTR", Value.Str1D(data, "SAVESTR"));
        this.globalMap.set("STR", Value.Str1D(data, "STR").reset(data.str));
        this.globalMap.set("RESULTS", Value.Str1D(data, "RESULTS"));
        this.globalMap.set("TSTR", Value.Str1D(data, "TSTR"));
        this.globalMap.set("SAVEDATA_TEXT", Value.Str0D(data, "SAVEDATA_TEXT"));
        this.globalMap.set("ISASSI", Value.IntChar0D(data, "ISASSI"));
        this.globalMap.set("NO", Value.IntChar0D(data, "NO"));
        this.globalMap.set("BASE", Value.IntChar1D(data, "BASE"));
        this.globalMap.set("MAXBASE", Value.IntChar1D(data, "MAXBASE"));
        this.globalMap.set("ABL", Value.IntChar1D(data, "ABL"));
        this.globalMap.set("TALENT", Value.IntChar1D(data, "TALENT", 1000));
        this.globalMap.set("EXP", Value.IntChar1D(data, "EXP"));
        this.globalMap.set("MARK", Value.IntChar1D(data, "MARK"));
        this.globalMap.set("PALAM", Value.IntChar1D(data, "PALAM", 1000));
        this.globalMap.set("SOURCE", Value.IntChar1D(data, "SOURCE", 1000));
        this.globalMap.set("EX", Value.IntChar1D(data, "EX", 1000));
        this.globalMap.set("CFLAG", Value.IntChar1D(data, "CFLAG", 1000));
        this.globalMap.set("JUEL", Value.IntChar1D(data, "JUEL", 1000));
        this.globalMap.set("RELATION", Value.IntChar1D(data, "RELATION", 1000));
        this.globalMap.set("EQUIP", Value.IntChar1D(data, "EQUIP", 1000));
        this.globalMap.set("TEQUIP", Value.IntChar1D(data, "TEQUIP", 1000));
        this.globalMap.set("STAIN", Value.IntChar1D(data, "STAIN", 1000));
        this.globalMap.set("GOTJUEL", Value.IntChar1D(data, "GOTJUEL", 1000));
        this.globalMap.set("NOWEX", Value.IntChar1D(data, "NOWEX", 1000));
        this.globalMap.set("DOWNBASE", Value.IntChar1D(data, "DOWNBASE", 1000));
        this.globalMap.set("CUP", Value.IntChar1D(data, "CUP", 1000));
        this.globalMap.set("CDOWN", Value.IntChar1D(data, "CDOWN", 1000));
        this.globalMap.set("TCVAR", Value.IntChar1D(data, "TCVAR", 1000));
        this.globalMap.set("NAME", Value.StrChar0D(data, "NAME"));
        this.globalMap.set("CALLNAME", Value.StrChar0D(data, "CALLNAME"));
        this.globalMap.set("NICKNAME", Value.StrChar0D(data, "NICKNAME"));
        this.globalMap.set("MASTERNAME", Value.StrChar0D(data, "MASTERNAME"));
        this.globalMap.set("CSTR", Value.StrChar1D(data, "CSTR"));
        // TODO: CDFLAG
        this.globalMap.set("DITEMTYPE", Value.Int2D(data, "DITEMTYPE"));
        this.globalMap.set("DA", Value.Int2D(data, "DA"));
        this.globalMap.set("DB", Value.Int2D(data, "DB"));
        this.globalMap.set("DC", Value.Int2D(data, "DC"));
        this.globalMap.set("DD", Value.Int2D(data, "DD"));
        this.globalMap.set("DE", Value.Int2D(data, "DE"));
        this.globalMap.set("TA", Value.Int3D(data, "TA"));
        this.globalMap.set("TB", Value.Int3D(data, "TB"));
        this.globalMap.set("RAND", new RandValue());
        this.globalMap.set("CHARANUM", new CharaNumValue());
        this.globalMap.set("ABLNAME", Value.Str1D(data, "ABLNAME").reset(data.ability));
        this.globalMap.set("EXPNAME", Value.Str1D(data, "EXPNAME").reset(data.exp));
        this.globalMap.set("TALENTNAME", Value.Str1D(data, "TALENTNAME").reset(data.talent));
        this.globalMap.set("PALAMNAME", Value.Str1D(data, "PALAMNAME").reset(data.palam));
        this.globalMap.set("TRAINNAME", Value.Str1D(data, "TRAINNAME").reset(data.train));
        this.globalMap.set("MARKNAME", Value.Str1D(data, "MARKNAME").reset(data.mark));
        this.globalMap.set("ITEMNAME", Value.Str1D(data, "ITEMNAME").reset(new Map([...data.item.entries()].map(([key, val]) => [key, val.name]))));
        this.globalMap.set("BASENAME", Value.Str1D(data, "BASENAME"));
        this.globalMap.set("SOURCENAME", Value.Str1D(data, "SOURCENAME"));
        this.globalMap.set("EXNAME", Value.Str1D(data, "EXNAME"));
        this.globalMap.set("EQUIPNAME", Value.Str1D(data, "EQUIPNAME"));
        this.globalMap.set("TEQUIPNAME", Value.Str1D(data, "TEQUIPNAME"));
        this.globalMap.set("FLAGNAME", Value.Str1D(data, "FLAGNAME"));
        this.globalMap.set("TFLAGNAME", Value.Str1D(data, "TFLAGNAME"));
        this.globalMap.set("CFLAGNAME", Value.Str1D(data, "CFLAGNAME"));
        this.globalMap.set("TCVARNAME", Value.Str1D(data, "TCVARNAME"));
        this.globalMap.set("CSTRNAME", Value.Str1D(data, "CSTRNAME"));
        this.globalMap.set("STAINNAME", Value.Str1D(data, "STAINNAME"));
        this.globalMap.set("CDFLAGNAME1", Value.Str1D(data, "CDFLAGNAME1"));
        this.globalMap.set("CDFLAGNAME2", Value.Str1D(data, "CDFLAGNAME2"));
        this.globalMap.set("STRNAME", Value.Str1D(data, "STRNAME"));
        this.globalMap.set("TSTRNAME", Value.Str1D(data, "TSTRNAME"));
        this.globalMap.set("SAVESTRNAME", Value.Str1D(data, "SAVESTRNAME"));
        this.globalMap.set("GLOBALNAME", Value.Str1D(data, "GLOBALNAME"));
        this.globalMap.set("GLOBALSNAME", Value.Str1D(data, "GLOBALSNAME"));
        this.globalMap.set("GAMEBASE_AUTHOR", Value.Str0D(data, "GAMEBASE_AUTHOR").reset(data.gamebase.author ?? ""));
        this.globalMap.set("GAMEBASE_INFO", Value.Str0D(data, "GAMEBASE_INFO").reset(data.gamebase.info ?? ""));
        this.globalMap.set("GAMEBASE_YEAR", Value.Str0D(data, "GAMEBASE_YEAR").reset(data.gamebase.year ?? ""));
        this.globalMap.set("GAMEBASE_TITLE", Value.Str0D(data, "GAMEBASE_TITLE").reset(data.gamebase.title ?? ""));
        this.globalMap.set("WINDOW_TITLE", Value.Str0D(data, "WINDOW_TITLE"));
        this.globalMap.set("MONEYLABEL", Value.Str0D(data, "MONEYLABEL"));
        // TODO: DRAWLINESTR
        this.globalMap.set("LASTLOAD_TEXT", Value.Str0D(data, "LASTLOAD_TEXT"));
        this.globalMap.set("GAMEBASE_GAMECODE", Value.Int0D(data, "GAMEBASE_GAMECODE").reset(data.gamebase.code ?? 0));
        this.globalMap.set("GAMEBASE_VERSION", Value.Int0D(data, "GAMEBASE_VERSION").reset(data.gamebase.version ?? 0));
        this.globalMap.set("GAMEBASE_ALLOWVERSION", Value.Int0D(data, "GAMEBASE_ALLOWVERSION"));
        this.globalMap.set("GAMEBASE_DEFAULTCHARA", Value.Int0D(data, "GAMEBASE_DEFAULTCHARA"));
        this.globalMap.set("GAMEBASE_NOITEM", Value.Int0D(data, "GAMEBASE_NOITEM"));
        this.globalMap.set("LASTLOAD_VERSION", Value.Int0D(data, "LASTLOAD_VERSION").reset(-1));
        this.globalMap.set("LASTLOAD_NO", Value.Int0D(data, "LASTLOAD_NO").reset(-1));
        this.globalMap.set("LINECOUNT", new LineCountValue());
        this.globalMap.set("ISTIMEOUT", Value.Int0D(data, "ISTIMEOUT"));
        this.globalMap.set("__INT_MAX__", Value.Int0D(data, "__INT_MAX__").reset(2 ** 32 - 1));
        this.globalMap.set("__INT_MIN__", Value.Int0D(data, "__INT_MIN__").reset(-(2 ** 32 - 1)));
        for (const [i, name] of data.ability.entries()) {
            this.globalMap.set(name, Value.Int0D(data, name).reset(i));
        }
        for (const [i, name] of data.exp.entries()) {
            this.globalMap.set(name, Value.Int0D(data, name).reset(i));
        }
        for (const [i, { name }] of data.item.entries()) {
            this.globalMap.set(name, Value.Int0D(data, name).reset(i));
        }
        for (const [i, name] of data.talent.entries()) {
            this.globalMap.set(name, Value.Int0D(data, name).reset(i));
        }
        for (const [i, name] of data.mark.entries()) {
            this.globalMap.set(name, Value.Int0D(data, name).reset(i));
        }
        for (const [i, name] of data.palam.entries()) {
            this.globalMap.set(name, Value.Int0D(data, name).reset(i));
        }
        for (const property of header) {
            if (property instanceof Dim) {
                this.globalMap.set(property.name, property.build(this));
            }
        }
        this.staticMap = new Map();
        this.staticMap.set("@DUMMY", new Map());
        let fnList = [...this.fnMap.values()];
        for (const events of this.eventMap.values()) {
            fnList = fnList.concat(events);
        }
        // TODO: #DIM REF
        for (const fn of fnList) {
            this.staticMap.set(fn.name, new Map());
            this.staticMap.get(fn.name).set("LOCAL", Value.Int1D(data, "LOCAL"));
            this.staticMap.get(fn.name).set("LOCALS", Value.Str1D(data, "LOCALS"));
            for (const property of fn.property) {
                if (property instanceof Dim && !property.isDynamic()) {
                    this.staticMap.get(fn.name).set(property.name, property.build(this));
                }
                else if (property instanceof LocalSize || property instanceof LocalSSize) {
                    property.apply(this, fn.name);
                }
            }
        }
        this.characterList = [];
    }
    configure(config) {
        this.color = {
            defaultFront: color.copy(config.front),
            defaultBack: color.copy(config.back),
            front: color.copy(config.front),
            back: color.copy(config.back),
            focus: color.copy(config.focus),
        };
    }
    context() {
        return this.contextStack[this.contextStack.length - 1];
    }
    pushContext(fn) {
        const context = {
            fn,
            dynamicMap: new Map(),
            refMap: new Map(),
        };
        context.dynamicMap.set("ARG", Value.Int1D(this.code.data, "ARG"));
        context.dynamicMap.set("ARGS", Value.Str1D(this.code.data, "ARGS"));
        for (const property of fn.property) {
            if (property instanceof Dim && property.isDynamic()) {
                context.dynamicMap.set(property.name, property.build(this));
            }
        }
        this.contextStack.push(context);
        return context;
    }
    popContext() {
        this.contextStack.pop();
    }
    getValue(name, scope) {
        if (scope != null) {
            if (!this.staticMap.has(scope)) {
                throw E.notFound("Scope", scope);
            }
            if (this.staticMap.get(scope).has(name)) {
                return this.staticMap.get(scope).get(name);
            }
            else {
                throw E.notFound("Variable", name + ":" + scope);
            }
        }
        else {
            const context = this.context();
            if (context.refMap.has(name)) {
                return this.getValue(context.refMap.get(name));
            }
            else if (context.dynamicMap.has(name)) {
                return context.dynamicMap.get(name);
            }
            else if (this.staticMap.get(context.fn.name).has(name)) {
                return this.staticMap.get(context.fn.name).get(name);
            }
            else if (this.globalMap.has(name)) {
                return this.globalMap.get(name);
            }
            else {
                throw new Error(`Variable ${name} does not exist`);
            }
        }
    }
    *start(external) {
        this.external = external;
        let begin = "TITLE";
        while (true) {
            let result = null;
            switch (begin.toUpperCase()) {
                case "TITLE":
                    result = yield* scene.TITLE(this);
                    break;
                case "FIRST":
                    result = yield* scene.FIRST(this);
                    break;
                case "SHOP":
                    result = yield* scene.SHOP(this);
                    break;
                case "TRAIN":
                    result = yield* scene.TRAIN(this);
                    break;
                case "AFTERTRAIN":
                    result = yield* scene.AFTERTRAIN(this);
                    break;
                case "ABLUP":
                    result = yield* scene.ABLUP(this);
                    break;
                case "TURNEND":
                    result = yield* scene.TURNEND(this);
                    break;
                case "DATALOADED":
                    result = yield* scene.DATALOADED(this);
                    break;
                default: throw E.notFound("Scene", begin);
            }
            switch (result?.type) {
                case "begin":
                    begin = result.keyword;
                    continue;
                case "goto": throw E.notFound("Label", result.label);
                case "break": return null;
                case "continue": return null;
                case "throw": throw new Error(`Uncaught error ${result.value}`);
                case "return": continue;
                case "quit": return null;
                case undefined: continue;
            }
        }
    }
    *run(statement, label) {
        try {
            return yield* statement.run(this, label);
        }
        catch (e) {
            if (e instanceof EraJSError) {
                throw e;
            }
            const trace = [];
            // NOTE: @DUMMY context is excluded
            for (const context of this.contextStack.slice(1)) {
                trace.push(context.fn.name);
            }
            throw new EraJSError(e.message, statement.raw, trace);
        }
    }
}
