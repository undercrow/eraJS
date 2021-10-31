import EraJSError from "./error";
import * as E from "./error";
import Fn from "./fn";
import Printer from "./printer";
import Define from "./property/define";
import Dim from "./property/dim";
import LocalSize from "./property/localsize";
import LocalSSize from "./property/localssize";
import PRNG from "./random";
import * as scene from "./scene";
import Thunk from "./thunk";
import Int0DValue from "./value/int-0d";
import Int1DValue from "./value/int-1d";
import Str1DValue from "./value/str-1d";
import CharaNumValue from "./value/special/charanum";
import LineCountValue from "./value/special/linecount";
import RandValue from "./value/special/rand";
import valueList from "./value-list";
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
    printer;
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
        for (const [id, character] of code.csv.character) {
            this.templateMap.set(id, character);
        }
        this.globalMap.set("GLOBAL", new Int1DValue("GLOBAL", code.csv.varSize.get("GLOBAL")));
        this.globalMap.set("GLOBALS", new Str1DValue("GLOBALS", code.csv.varSize.get("GLOBALS")));
    }
    async reset() {
        this.printer = new Printer();
        this.printCPerLine = 3; // TODO
        const globalMap = this.globalMap;
        const { header, csv } = this.code;
        const varSize = new Map(csv.varSize);
        for (const [name, Cls, size, mergeList] of valueList) {
            let mergeSize;
            for (const mergeName of mergeList ?? []) {
                if (varSize.has(mergeName)) {
                    const prev0 = (mergeSize ?? [0])[0];
                    const size0 = varSize.get(mergeName)[0];
                    mergeSize = [Math.max(prev0, size0)];
                }
            }
            const value = new Cls(name, mergeSize ?? varSize.get(name) ?? size);
            globalMap.set(name, value);
        }
        globalMap.set("RAND", new RandValue());
        globalMap.set("CHARANUM", new CharaNumValue());
        globalMap.set("LINECOUNT", new LineCountValue());
        globalMap.get("ITEMPRICE").reset(new Map([...csv.item.entries()].map(([key, val]) => [key, val.price])));
        globalMap.get("STR").reset(csv.str);
        globalMap.get("PALAMLV").reset([0, 100, 500, 3000, 10000, 30000, 60000, 100000, 150000, 250000]);
        globalMap.get("EXPLV").reset([0, 1, 4, 20, 50, 200]);
        globalMap.get("ASSI").reset([-1]);
        globalMap.get("TARGET").reset([1]);
        globalMap.get("PBAND").reset([4]);
        globalMap.get("EJAC").reset([10000]);
        globalMap.get("RANDDATA").reset([this.random.state]);
        globalMap.get("ABLNAME").reset(csv.abl);
        globalMap.get("EXPNAME").reset(csv.exp);
        globalMap.get("TALENTNAME").reset(csv.talent);
        globalMap.get("PALAMNAME").reset(csv.palam);
        globalMap.get("TRAINNAME").reset(csv.train);
        globalMap.get("MARKNAME").reset(csv.mark);
        globalMap.get("ITEMNAME").reset(new Map([...csv.item.entries()].map(([key, val]) => [key, val.name])));
        globalMap.get("BASENAME").reset(csv.base);
        globalMap.get("SOURCENAME").reset(csv.source);
        globalMap.get("EXNAME").reset(csv.ex);
        globalMap.get("EQUIPNAME").reset(csv.equip);
        globalMap.get("TEQUIPNAME").reset(csv.tequip);
        globalMap.get("FLAGNAME").reset(csv.flag);
        globalMap.get("TFLAGNAME").reset(csv.tflag);
        globalMap.get("CFLAGNAME").reset(csv.cflag);
        globalMap.get("TCVARNAME").reset(csv.tcvar);
        globalMap.get("CSTRNAME").reset(csv.cstr);
        globalMap.get("STAINNAME").reset(csv.stain);
        globalMap.get("CDFLAGNAME1").reset(csv.cdflag1);
        globalMap.get("CDFLAGNAME2").reset(csv.cdflag2);
        globalMap.get("STRNAME").reset(csv.str);
        globalMap.get("TSTRNAME").reset(csv.tstr);
        globalMap.get("SAVESTRNAME").reset(csv.saveStr);
        globalMap.get("GLOBALNAME").reset(csv.global);
        globalMap.get("GLOBALSNAME").reset(csv.globalS);
        globalMap.get("GAMEBASE_AUTHOR").reset(csv.gamebase.author ?? "");
        globalMap.get("GAMEBASE_INFO").reset(csv.gamebase.info ?? "");
        globalMap.get("GAMEBASE_YEAR").reset(csv.gamebase.year ?? "");
        globalMap.get("GAMEBASE_TITLE").reset(csv.gamebase.title ?? "");
        // TODO: DRAWLINESTR
        globalMap.get("GAMEBASE_GAMECODE").reset(csv.gamebase.code ?? 0);
        globalMap.get("GAMEBASE_VERSION").reset(csv.gamebase.version ?? 0);
        globalMap.get("LASTLOAD_VERSION").reset(-1);
        globalMap.get("LASTLOAD_NO").reset(-1);
        globalMap.get("__INT_MAX__").reset(2n ** 63n - 1n);
        globalMap.get("__INT_MIN__").reset(-(2n ** 63n - 1n));
        for (const [i, name] of csv.abl.entries()) {
            globalMap.set(name, new Int0DValue(name).reset(i));
        }
        for (const [i, name] of csv.exp.entries()) {
            globalMap.set(name, new Int0DValue(name).reset(i));
        }
        for (const [i, { name }] of csv.item.entries()) {
            globalMap.set(name, new Int0DValue(name).reset(i));
        }
        for (const [i, name] of csv.talent.entries()) {
            globalMap.set(name, new Int0DValue(name).reset(i));
        }
        for (const [i, name] of csv.mark.entries()) {
            globalMap.set(name, new Int0DValue(name).reset(i));
        }
        for (const [i, name] of csv.palam.entries()) {
            globalMap.set(name, new Int0DValue(name).reset(i));
        }
        for (const property of header) {
            if (property instanceof Dim) {
                globalMap.set(property.name, await property.build(this));
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
            this.staticMap.get(fn.name).set("LOCAL", new Int1DValue("LOCAL", varSize.get("LOCAL")));
            this.staticMap.get(fn.name).set("LOCALS", new Str1DValue("LOCALS", varSize.get("LOCALS")));
            for (const property of fn.property) {
                if (property instanceof Dim && !property.isDynamic()) {
                    this.staticMap.get(fn.name).set(property.name, await property.build(this));
                }
                else if (property instanceof LocalSize || property instanceof LocalSSize) {
                    property.apply(this, fn.name);
                }
            }
        }
        this.characterList = [];
    }
    configure(config) {
        this.printer.defaultColor = config.front;
        this.printer.defaultBackground = config.back;
        this.printer.color = config.front;
        this.printer.background = config.back;
        this.printer.focus = config.focus;
    }
    context() {
        return this.contextStack[this.contextStack.length - 1];
    }
    async pushContext(fn) {
        const context = {
            fn,
            dynamicMap: new Map(),
            refMap: new Map(),
        };
        context.dynamicMap.set("ARG", new Int1DValue("ARG", this.code.csv.varSize.get("ARG")));
        context.dynamicMap.set("ARGS", new Str1DValue("ARGS", this.code.csv.varSize.get("ARGS")));
        for (const property of fn.property) {
            if (property instanceof Dim && property.isDynamic()) {
                context.dynamicMap.set(property.name, await property.build(this));
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
    async *start(external) {
        this.external = external;
        await this.reset();
        this.contextStack = [];
        // Push dummy context for outermost call
        await this.pushContext(new Fn("@DUMMY", [], [], new Thunk([])));
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
    async *run(statement, label) {
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
