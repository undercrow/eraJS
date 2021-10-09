import * as assert from "./assert";
import Character from "./character";
import type Config from "./config";
import * as color from "./color";
import type Color from "./color";
import {Template, Data} from "./data";
import Fn from "./fn";
import type Property from "./property";
import Define from "./property/define";
import Dim from "./property/dim";
import DimConst from "./property/dim-const";
import DimDynamic from "./property/dim-dynamic";
import LocalSize from "./property/localsize";
import LocalSSize from "./property/localssize";
import PRNG from "./random";
import {BaseSave} from "./savedata";
import type {default as Statement, Result} from "./statement";
import type {Align} from "./statement/command/alignment";
import * as scene from "./scene";
import Thunk from "./thunk";
import Value from "./value";

type Context = {
	fn: Fn;
	dynamicMap: Map<string, Value>;
	refMap: Map<string, string>;
};

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
	public random: PRNG;
	public code: {
		header: Property[];
		// TODO: Replace this with fnMap
		fnList: Fn[];
		data: Data;
	};
	public DEFAULT_STORAGE: Record<string, string> = {};
	public external: {
		getFont: (name: string) => boolean;
		getSavedata: (key: string) => string | undefined;
		setSavedata: (key: string, value: string) => void;
	};

	public eventMap: Map<string, Fn[]>;
	public fnMap: Map<string, Fn>;
	public macroMap: Map<string, Define>;
	public templateMap: Map<number, Template>;

	public globalMap: Map<string, Value>;
	public staticMap: Map<string, Map<string, Value>>;
	public characterList: Array<Character>;
	private contextStack: Array<Context>;

	public alignment!: Align;
	public draw!: boolean;
	public isLineEmpty!: boolean;
	public skipDisp!: boolean;
	public font!: {
		name: string;
		bold: boolean;
		italic: boolean;
		strike: boolean;
		underline: boolean;
	};
	public color!: {
		defaultFront: Color;
		defaultBack: Color;
		front: Color;
		back: Color;
		focus: Color;
	};
	public printCPerLine!: number;

	public constructor(code: VM["code"], external?: VM["external"]) {
		this.random = new PRNG();
		this.code = code;
		this.external = external ?? {
			getFont: () => false,
			getSavedata: (key) => this.DEFAULT_STORAGE[key],
			setSavedata: (key, value) => { this.DEFAULT_STORAGE[key] = value; },
		};

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
				this.eventMap.get(fn.name)!.push(fn);
			} else {
				this.fnMap.set(fn.name, fn);
			}
		}

		// Reorder functions
		for (const events of this.eventMap.values()) {
			events.sort((a, b) => {
				if (a.isFirst()) { return -1; }
				if (b.isFirst()) { return 1; }
				if (a.isLast()) { return 1; }
				if (b.isLast()) { return -1; }
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

	public reset() {
		this.alignment = "LEFT";
		this.draw = true;
		this.isLineEmpty = true;
		this.skipDisp = false;
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

		const {header, data} = this.code;
		this.globalMap.set("RAND", Value.Rand(data, "RAND"));
		this.globalMap.set("RESULT", Value.Int1D(data, "RESULT"));
		this.globalMap.set("RESULTS", Value.Str1D(data, "RESULTS"));
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
		this.globalMap.set("COUNT", Value.Int1D(data, "COUNT"));
		this.globalMap.set("DAY", Value.Int1D(data, "DAY"));
		this.globalMap.set("TIME", Value.Int1D(data, "TIME"));
		this.globalMap.set("MONEY", Value.Int1D(data, "MONEY"));
		this.globalMap.set("MASTER", Value.Int1D(data, "MASTER"));
		this.globalMap.set("TARGET", Value.Int1D(data, "TARGET").reset([1]));
		this.globalMap.set("ASSI", Value.Int1D(data, "ASSI").reset([-1]));
		this.globalMap.set("PLAYER", Value.Int1D(data, "PLAYER"));
		this.globalMap.set("ASSIPLAY", Value.Int1D(data, "ASSIPLAY"));
		this.globalMap.set("SELECTCOM", Value.Int1D(data, "SELECTCOM"));
		this.globalMap.set("PREVCOM", Value.Int1D(data, "PREVCOM").reset([-1]));
		this.globalMap.set("NEXTCOM", Value.Int1D(data, "NEXTCOM").reset([-1]));
		this.globalMap.set("LOSEBASE", Value.Int1D(data, "LOSEBASE"));
		this.globalMap.set("UP", Value.Int1D(data, "UP"));
		this.globalMap.set("DOWN", Value.Int1D(data, "DOWN"));
		this.globalMap.set("PALAMLV", Value.Int1D(data, "PALAMLV").reset(
			[0, 100, 500, 3000, 10000, 30000, 60000, 100000, 150000, 250000],
		));
		this.globalMap.set("EXPLV", Value.Int1D(data, "EXPLV").reset([0, 1, 4, 20, 50, 200]));
		this.globalMap.set("EJAC", Value.Int1D(data, "EJAC").reset([10000]));
		this.globalMap.set("FLAG", Value.Int1D(data, "FLAG", 10000));
		this.globalMap.set("TFLAG", Value.Int1D(data, "TFLAG"));
		this.globalMap.set("ITEM", Value.Int1D(data, "ITEM"));
		this.globalMap.set("ITEMSALES", Value.Int1D(data, "ITEMSALES"));
		this.globalMap.set("BOUGHT", Value.Int1D(data, "BOUGHT"));
		this.globalMap.set("PBAND", Value.Int1D(data, "PBAND").reset([4]));
		this.globalMap.set("CHARANUM", Value.Int0D(data, "CHARANUM"));
		this.globalMap.set("STR", Value.Str1D(data, "STR").reset(data.str));
		this.globalMap.set("NO", Value.IntChar0D(data, "NO"));
		this.globalMap.set("ISASSI", Value.IntChar0D(data, "ISASSI"));
		this.globalMap.set("NAME", Value.StrChar0D(data, "NAME"));
		this.globalMap.set("CALLNAME", Value.StrChar0D(data, "CALLNAME"));
		this.globalMap.set("BASE", Value.IntChar1D(data, "BASE"));
		this.globalMap.set("MAXBASE", Value.IntChar1D(data, "MAXBASE"));
		this.globalMap.set("ABL", Value.IntChar1D(data, "ABL"));
		this.globalMap.set("TALENT", Value.IntChar1D(data, "TALENT", 1000));
		this.globalMap.set("EXP", Value.IntChar1D(data, "EXP"));
		this.globalMap.set("MARK", Value.IntChar1D(data, "MARK"));
		this.globalMap.set("RELATION", Value.IntChar1D(data, "RELATION", 1000));
		this.globalMap.set("JUEL", Value.IntChar1D(data, "JUEL", 1000));
		this.globalMap.set("CFLAG", Value.IntChar1D(data, "CFLAG", 1000));
		this.globalMap.set("EQUIP", Value.IntChar1D(data, "EQUIP", 1000));
		this.globalMap.set("TEQUIP", Value.IntChar1D(data, "TEQUIP", 1000));
		this.globalMap.set("PALAM", Value.IntChar1D(data, "PALAM", 1000));
		this.globalMap.set("STAIN", Value.IntChar1D(data, "STAIN", 1000));
		this.globalMap.set("EX", Value.IntChar1D(data, "EX", 1000));
		this.globalMap.set("SOURCE", Value.IntChar1D(data, "SOURCE", 1000));
		this.globalMap.set("NOWEX", Value.IntChar1D(data, "NOWEX", 1000));
		this.globalMap.set("GOTJUEL", Value.IntChar1D(data, "GOTJUEL", 1000));
		this.globalMap.set("ABLNAME", Value.Str1D(data, "ABLNAME").reset(data.ability));
		this.globalMap.set("TALENTNAME", Value.Str1D(data, "TALENTNAME").reset(data.talent));
		this.globalMap.set("EXPNAME", Value.Str1D(data, "EXPNAME").reset(data.exp));
		this.globalMap.set("MARKNAME", Value.Str1D(data, "MARKNAME").reset(data.mark));
		this.globalMap.set("PALAMNAME", Value.Str1D(data, "PALAMNAME").reset(data.palam));
		this.globalMap.set("ITEMNAME", Value.Str1D(data, "ITEMNAME").reset(
			new Map([...data.item.entries()].map(([key, val]) => [key, val.name])),
		));
		this.globalMap.set("NOITEM", Value.Int1D(data, "NOITEM"));
		this.globalMap.set("LINECOUNT", Value.Int0D(data, "LINECOUNT"));
		this.globalMap.set("ISTIMEOUT", Value.Int0D(data, "ISTIMEOUT"));
		this.globalMap.set("__INT_MAX__", Value.Int0D(data, "__INT_MAX__").reset(2 ** 32 - 1));
		this.globalMap.set("__INT_MIN__", Value.Int0D(data, "__INT_MIN__").reset(-(2 ** 32 - 1)));
		this.globalMap.set("RANDDATA", Value.Int1D(data, "RANDDATA").reset([this.random.state]));
		this.globalMap.set("TSTR", Value.Str1D(data, "TSTR"));
		this.globalMap.set("DA", Value.Int2D(data, "DA"));
		this.globalMap.set("DB", Value.Int2D(data, "DB"));
		this.globalMap.set("DC", Value.Int2D(data, "DC"));
		this.globalMap.set("DD", Value.Int2D(data, "DD"));
		this.globalMap.set("DE", Value.Int2D(data, "DE"));
		this.globalMap.set("DITEMTYPE", Value.Int2D(data, "DITEMTYPE"));
		this.globalMap.set("NICKNAME", Value.StrChar0D(data, "NICKNAME"));
		this.globalMap.set("MASTERNAME", Value.StrChar0D(data, "MASTERNAME"));
		this.globalMap.set("DOWNBASE", Value.IntChar1D(data, "DOWNBASE", 1000));
		this.globalMap.set("CUP", Value.IntChar1D(data, "CUP", 1000));
		this.globalMap.set("CDOWN", Value.IntChar1D(data, "CDOWN", 1000));
		this.globalMap.set("TCVAR", Value.IntChar1D(data, "TCVAR", 1000));
		this.globalMap.set("CSTR", Value.StrChar1D(data, "CSTR"));
		this.globalMap.set("ITEMPRICE", Value.Int1D(data, "ITEMPRICE").reset(
			new Map([...data.item.entries()].map(([key, val]) => [key, val.price])),
		));
		this.globalMap.set("TRAINNAME", Value.Str1D(data, "TRAINNAME").reset(data.train));
		this.globalMap.set("BASENAME", Value.Str1D(data, "BASENAME"));
		this.globalMap.set("EQUIPNAME", Value.Str1D(data, "EQUIPNAME"));
		this.globalMap.set("TEQUIPNAME", Value.Str1D(data, "TEQUIPNAME"));
		this.globalMap.set("STAINNAME", Value.Str1D(data, "STAINNAME"));
		this.globalMap.set("EXNAME", Value.Str1D(data, "EXNAME"));
		this.globalMap.set("SOURCENAME", Value.Str1D(data, "SOURCENAME"));
		this.globalMap.set("FLAGNAME", Value.Str1D(data, "FLAGNAME"));
		this.globalMap.set("TFLAGNAME", Value.Str1D(data, "TFLAGNAME"));
		this.globalMap.set("CFLAGNAME", Value.Str1D(data, "CFLAGNAME"));
		this.globalMap.set("TCVARNAME", Value.Str1D(data, "TCVARNAME"));
		this.globalMap.set("STRNAME", Value.Str1D(data, "STRNAME"));
		this.globalMap.set("TSTRNAME", Value.Str1D(data, "TSTRNAME"));
		this.globalMap.set("CSTRNAME", Value.Str1D(data, "CSTRNAME"));
		this.globalMap.set("SAVESTRNAME", Value.Str1D(data, "SAVESTRNAME"));
		this.globalMap.set("CDFLAGNAME1", Value.Str1D(data, "CDFLAGNAME1"));
		this.globalMap.set("CDFLAGNAME2", Value.Str1D(data, "CDFLAGNAME2"));
		this.globalMap.set("GLOBALNAME", Value.Str1D(data, "GLOBALNAME"));
		this.globalMap.set("GLOBALSNAME", Value.Str1D(data, "GLOBALSNAME"));
		this.globalMap.set("GAMEBASE_AUTHOR", Value.Str0D(data, "GAMEBASE_AUTHOR").reset(
			data.gamebase.author ?? "",
		));
		this.globalMap.set("GAMEBASE_INFO", Value.Str0D(data, "GAMEBASE_INFO").reset(
			data.gamebase.info ?? "",
		));
		this.globalMap.set("GAMEBASE_YEAR", Value.Str0D(data, "GAMEBASE_YEAR").reset(
			data.gamebase.year ?? "",
		));
		this.globalMap.set("GAMEBASE_TITLE", Value.Str0D(data, "GAMEBASE_TITLE").reset(
			data.gamebase.title ?? "",
		));
		this.globalMap.set("GAMEBASE_GAMECODE", Value.Int0D(data, "GAMEBASE_GAMECODE").reset(
			data.gamebase.code ?? 0,
		));
		this.globalMap.set("GAMEBASE_VERSION", Value.Int0D(data, "GAMEBASE_VERSION").reset(
			data.gamebase.version ?? 0,
		));
		this.globalMap.set("GAMEBASE_ALLOWVERSION", Value.Int0D(data, "GAMEBASE_ALLOWVERSION"));
		this.globalMap.set("GAMEBASE_DEFAULTCHARA", Value.Int0D(data, "GAMEBASE_DEFAULTCHARA"));
		this.globalMap.set("GAMEBASE_NOITEM", Value.Int0D(data, "GAMEBASE_NOITEM"));
		this.globalMap.set("WINDOW_TITLE", Value.Str0D(data, "WINDOW_TITLE"));
		this.globalMap.set("MONEYLABEL", Value.Str0D(data, "MONEYLABEL"));
		this.globalMap.set("LASTLOAD_VERSION", Value.Int0D(data, "LASTLOAD_VERSION").reset(-1));
		this.globalMap.set("LASTLOAD_NO", Value.Int0D(data, "LASTLOAD_NO").reset(-1));
		this.globalMap.set("LASTLOAD_TEXT", Value.Str0D(data, "LASTLOAD_TEXT"));
		this.globalMap.set("SAVEDATA_TEXT", Value.Str0D(data, "SAVEDATA_TEXT"));
		for (const [i, name] of data.ability.entries()) {
			this.globalMap.set(name, Value.Int0D(data, name).reset(i));
		}
		for (const [i, name] of data.exp.entries()) {
			this.globalMap.set(name, Value.Int0D(data, name).reset(i));
		}
		for (const [i, {name}] of data.item.entries()) {
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
				property.apply(this, this.globalMap);
			} else if (property instanceof DimConst) {
				property.apply(this, this.globalMap);
			}
		}

		this.staticMap = new Map();
		this.staticMap.set("@DUMMY", new Map());

		let fnList = [...this.fnMap.values()];
		for (const events of this.eventMap.values()) {
			fnList = fnList.concat(events);
		}
		for (const fn of fnList) {
			// TODO: Initialize staticMap only once
			this.staticMap.set(fn.name, new Map());
			this.staticMap.get(fn.name)!.set("LOCAL", Value.Int1D(data, "LOCAL"));
			this.staticMap.get(fn.name)!.set("LOCALS", Value.Str1D(data, "LOCALS"));
			for (const property of fn.property) {
				if (property instanceof Dim) {
					property.apply(this, this.staticMap.get(fn.name)!);
				} else if (property instanceof DimConst) {
					property.apply(this, this.staticMap.get(fn.name)!);
				} else if (property instanceof LocalSize || property instanceof LocalSSize) {
					property.apply(this, fn.name);
				}
			}
		}

		this.characterList = [];
	}

	public configure(config: Config) {
		this.color = {
			defaultFront: color.copy(config.front),
			defaultBack: color.copy(config.back),
			front: color.copy(config.front),
			back: color.copy(config.back),
			focus: color.copy(config.focus),
		};
	}

	public context(): Context {
		return this.contextStack[this.contextStack.length - 1];
	}

	public pushContext(fn: Fn): Context {
		const context: Context = {
			fn,
			dynamicMap: new Map(),
			refMap: new Map(),
		};
		context.dynamicMap.set("ARG", Value.Int1D(this.code.data, "ARG"));
		context.dynamicMap.set("ARGS", Value.Str1D(this.code.data, "ARGS"));
		for (const property of fn.property) {
			if (property instanceof DimDynamic) {
				property.apply(this);
			}
		}

		this.contextStack.push(context);

		return context;
	}

	public popContext(): void {
		this.contextStack.pop();
	}

	public getValue<T extends Value>(name: string, scope?: string): T {
		if (scope != null) {
			if (!this.staticMap.has(scope)) {
				throw new Error(`Scope ${scope} does not exist`);
			}
			if (this.staticMap.get(scope)!.has(name)) {
				return this.staticMap.get(scope)!.get(name)! as T;
			} else {
				throw new Error(`Variable ${name}:${scope} does not exist`);
			}
		} else {
			const context = this.context();
			if (context.refMap.has(name)) {
				return this.getValue(context.refMap.get(name)!);
			} else if (context.dynamicMap.has(name)) {
				return context.dynamicMap.get(name)! as T;
			} else if (this.staticMap.get(context.fn.name)!.has(name)) {
				return this.staticMap.get(context.fn.name)!.get(name)! as T;
			} else if (this.globalMap.has(name)) {
				return this.globalMap.get(name)! as T;
			} else {
				throw new Error(`Variable ${name} does not exist`);
			}
		}
	}

	public *start(): ReturnType<Statement["run"]> {
		let begin = "TITLE";
		while (true) {
			let result: Result | null = null;
			switch (begin.toUpperCase()) {
				case "TITLE": result = yield* scene.TITLE(this); break;
				case "FIRST": result = yield* scene.FIRST(this); break;
				case "SHOP": result = yield* scene.SHOP(this); break;
				case "TRAIN": result = yield* scene.TRAIN(this); break;
				case "AFTERTRAIN": result = yield* scene.AFTERTRAIN(this); break;
				case "ABLUP": result = yield* scene.ABLUP(this); break;
				case "TURNEND": result = yield* scene.TURNEND(this); break;
				default: {
					throw new Error(`${begin} is not a valid keyword`);
				}
			}

			switch (result?.type) {
				case "begin": begin = result.keyword; continue;
				case "goto": throw new Error(`Label ${result.label} not found`);
				case "break": return null;
				case "continue": return null;
				case "throw": throw new Error(`Uncaught error ${result.value}`);
				case "return": continue;
				case "quit": return null;
				case undefined: continue;
			}
		}
	}

	public *print(text: string, cell?: "LEFT" | "RIGHT"): ReturnType<Statement["run"]> {
		if (text.length > 0) {
			yield <const>{type: "string", text, cell};
			this.isLineEmpty = false;
		}

		return null;
	}

	public *newline(): ReturnType<Statement["run"]> {
		yield <const>{type: "newline"};
		const lineCount = this.getValue("LINECOUNT").get(this, []) as number;
		this.getValue("LINECOUNT").set(this, lineCount + 1, []);
		this.isLineEmpty = true;

		return null;
	}

	public *printSingle(text: string): ReturnType<Statement["run"]> {
		if (!this.isLineEmpty) {
			yield* this.newline();
		}
		yield* this.print(text);
		yield* this.newline();

		return null;
	}

	public loadData(name: string): BaseSave | null {
		const raw = this.external.getSavedata(name);
		if (raw == null) {
			return null;
		}

		const parsed: BaseSave = JSON.parse(raw);
		assert.number(parsed.code, `Save file ${name} is not in a valid format`);
		assert.number(parsed.version, `Save file ${name} is not in a valid format`);
		assert.cond(parsed.data != null, `Save file ${name} is not in a valid format`);

		return parsed;
	}

	public saveData(name: string, value: BaseSave) {
		this.external.setSavedata(name, JSON.stringify(value));
	}
}
