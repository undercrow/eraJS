import type Config from "./config";
import * as color from "./color";
import type Color from "./color";
import {Character, Data} from "./data";
import Fn from "./fn";
import type Property from "./property";
import Define from "./property/define";
import Dim from "./property/dim";
import DimConst from "./property/dim-const";
import DimDynamic from "./property/dim-dynamic";
import LocalSize from "./property/localsize";
import LocalSSize from "./property/localssize";
import PRNG from "./random";
import type {default as Statement, Result} from "./statement";
import type {Align} from "./statement/command/alignment";
import * as scene from "./scene";
import Thunk from "./thunk";
import type Value from "./value";
import Int0DValue from "./value/int-0d";
import Int1DValue from "./value/int-1d";
import IntChar0DValue from "./value/int-char-0d";
import IntChar1DValue from "./value/int-char-1d";
import RandValue from "./value/rand";
import Str0DValue from "./value/str-0d";
import Str1DValue from "./value/str-1d";
import StrChar0DValue from "./value/str-char-0d";
import StrChar1DValue from "./value/str-char-1d";

type Context = {
	fn: Fn;
	dynamicMap: Map<string, Value>;
	refMap: Map<string, string>;
};

export default class VM {
	public random: PRNG;
	public code: {
		header: Property[];
		// TODO: Replace this with fnMap
		fnList: Fn[];
		data: Data;
	};
	public DEFAULT_STORAGE: Record<string, string> = {};
	public storage: {
		get: (key: string) => string | undefined;
		set: (key: string, value: string) => void;
		del: (key: string) => void;
	};

	public fnMap: Map<string, Fn[]>;
	public macroMap: Map<string, Define>;
	public characterMap: Map<number, Character>;

	public globalMap: Map<string, Value>;
	public staticMap: Map<string, Map<string, Value>>;
	private contextStack: Array<Context>;

	public alignment!: Align;
	public draw!: boolean;
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

	public constructor(code: VM["code"], storage?: VM["storage"]) {
		this.random = new PRNG();
		this.code = code;
		this.storage = storage ?? {
			get: (key) => this.DEFAULT_STORAGE[key],
			set: (key, value) => { this.DEFAULT_STORAGE[key] = value; },
			del: (key) => { delete this.DEFAULT_STORAGE[key]; },
		};

		this.fnMap = new Map();
		this.macroMap = new Map();
		this.characterMap = new Map();
		this.globalMap = new Map();
		this.staticMap = new Map();
		this.contextStack = [];

		for (const fn of code.fnList) {
			if (!this.fnMap.has(fn.name)) {
				this.fnMap.set(fn.name, []);
			}
			this.fnMap.get(fn.name)!.push(fn);
		}

		// Reorder functions
		for (const fn of this.fnMap.keys()) {
			this.fnMap.get(fn)!.sort((a, b) => {
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
			this.characterMap.set(id, character);
		}

		this.resetVariable("GLOBAL", Int1DValue);
		this.resetVariable("GLOBALS", Str1DValue);
		this.reset();

		// Push dummy context for outermost call
		this.pushContext(new Fn("@DUMMY", [], [], new Thunk([])));
	}

	private resetVariable(name: string, cls: typeof RandValue): void;
	private resetVariable(name: string, cls: typeof Int0DValue, value?: Int0DValue): void;
	private resetVariable(name: string, cls: typeof Str0DValue, value?: Str0DValue): void;
	private resetVariable(name: string, cls: typeof Int1DValue): void;
	private resetVariable(name: string, cls: typeof Int1DValue, size: number): void;
	private resetVariable(name: string, cls: typeof Int1DValue, value?: Int1DValue): void;
	private resetVariable(name: string, cls: typeof Str1DValue): void;
	private resetVariable(name: string, cls: typeof Str1DValue, size: number): void;
	private resetVariable(name: string, cls: typeof Str1DValue, value?: Str1DValue): void;
	private resetVariable(name: string, cls: typeof IntChar0DValue): void;
	private resetVariable(name: string, cls: typeof StrChar0DValue): void;
	private resetVariable(name: string, cls: typeof IntChar1DValue, size?: number): void;
	private resetVariable(name: string, cls: typeof StrChar1DValue, size?: number): void;
	private resetVariable(
		name: string,
		Cls: new (...arg: any) => Value,
		...arg: any[]
	) {
		switch (Cls) {
			case RandValue: {
				this.globalMap.set(name, new RandValue());
				break;
			}
			case Int0DValue: {
				if (arg[0] != null) {
					this.globalMap.set(name, arg[0]);
				} else {
					this.globalMap.set(name, new Int0DValue());
				}
				break;
			}
			case Str0DValue: {
				if (arg[0] != null) {
					this.globalMap.set(name, arg[0]);
				} else {
					this.globalMap.set(name, new Str0DValue());
				}
				break;
			}
			case Int1DValue: {
				if (arg[0] instanceof Int1DValue) {
					this.globalMap.set(name, arg[0]);
				} else {
					const size = this.code.data.varSize.get(name) ?? arg[0] ?? 1000;
					this.globalMap.set(name, new Int1DValue(size));
				}
				break;
			}
			case Str1DValue: {
				if (arg[0] instanceof Str1DValue) {
					this.globalMap.set(name, arg[0]);
				} else {
					const size = this.code.data.varSize.get(name) ?? arg[0] ?? 100;
					this.globalMap.set(name, new Str1DValue(size));
				}
				break;
			}
			case IntChar0DValue: {
				this.globalMap.set(name, new IntChar0DValue());
				break;
			}
			case StrChar0DValue: {
				this.globalMap.set(name, new StrChar0DValue());
				break;
			}
			case IntChar1DValue: {
				const size = this.code.data.varSize.get(name) ?? arg[0] ?? 100;
				this.globalMap.set(name, new IntChar1DValue(size));
				break;
			}
			case StrChar1DValue: {
				const size = this.code.data.varSize.get(name) ?? arg[0] ?? 100;
				this.globalMap.set(name, new StrChar1DValue(size));
				break;
			}
			default: {
				throw new Error("Unexpected value class detected!");
			}
		}
	}

	public reset() {
		this.alignment = "LEFT";
		this.draw = true;
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
		this.resetVariable("RAND", RandValue);
		this.resetVariable("RESULT", Int1DValue);
		this.resetVariable("RESULTS", Str1DValue);
		this.resetVariable("A", Int1DValue);
		this.resetVariable("B", Int1DValue);
		this.resetVariable("C", Int1DValue);
		this.resetVariable("D", Int1DValue);
		this.resetVariable("E", Int1DValue);
		this.resetVariable("F", Int1DValue);
		this.resetVariable("G", Int1DValue);
		this.resetVariable("H", Int1DValue);
		this.resetVariable("I", Int1DValue);
		this.resetVariable("J", Int1DValue);
		this.resetVariable("K", Int1DValue);
		this.resetVariable("L", Int1DValue);
		this.resetVariable("M", Int1DValue);
		this.resetVariable("N", Int1DValue);
		this.resetVariable("O", Int1DValue);
		this.resetVariable("P", Int1DValue);
		this.resetVariable("Q", Int1DValue);
		this.resetVariable("R", Int1DValue);
		this.resetVariable("S", Int1DValue);
		this.resetVariable("T", Int1DValue);
		this.resetVariable("U", Int1DValue);
		this.resetVariable("V", Int1DValue);
		this.resetVariable("W", Int1DValue);
		this.resetVariable("X", Int1DValue);
		this.resetVariable("Y", Int1DValue);
		this.resetVariable("Z", Int1DValue);
		this.resetVariable("COUNT", Int0DValue);
		this.resetVariable("DAY", Int1DValue);
		this.resetVariable("TIME", Int0DValue);
		this.resetVariable("MONEY", Int1DValue);
		this.resetVariable("MASTER", Int0DValue);
		this.resetVariable("TARGET", Int0DValue, Int0DValue.from(-1));
		this.resetVariable("ASSI", Int0DValue, Int0DValue.from(-1));
		this.resetVariable("PLAYER", Int0DValue);
		this.resetVariable("ASSIPLAY", Int0DValue);
		this.resetVariable("SELECTCOM", Int1DValue);
		this.resetVariable("PREVCOM", Int0DValue);
		this.resetVariable("NEXTCOM", Int0DValue);
		this.resetVariable("LOSEBASE", Int1DValue);
		this.resetVariable("UP", Int1DValue);
		this.resetVariable("DOWN", Int1DValue);
		this.resetVariable("PALAMLV", Int1DValue, Int1DValue.from(
			[0, 100, 500, 3000, 10000, 30000, 60000, 100000, 150000, 250000],
		));
		this.resetVariable("EXPLV", Int1DValue, Int1DValue.from([0, 1, 4, 20, 50, 200]));
		this.resetVariable("EJAC", Int0DValue, Int0DValue.from(10000));
		this.resetVariable("FLAG", Int1DValue, 10000);
		this.resetVariable("TFLAG", Int1DValue);
		this.resetVariable("ITEM", Int1DValue);
		this.resetVariable("ITEMSALES", Int1DValue);
		this.resetVariable("BOUGHT", Int0DValue);
		this.resetVariable("PBAND", Int0DValue, Int0DValue.from(4));
		this.resetVariable("CHARANUM", Int0DValue);
		this.resetVariable("STR", Str1DValue);
		(this.globalMap.get("STR") as Str1DValue).reset(this, data.str);
		this.resetVariable("NO", IntChar0DValue);
		this.resetVariable("ISASSI", IntChar0DValue);
		this.resetVariable("NAME", StrChar0DValue);
		this.resetVariable("CALLNAME", StrChar0DValue);
		this.resetVariable("BASE", IntChar1DValue);
		this.resetVariable("MAXBASE", IntChar1DValue);
		this.resetVariable("ABL", IntChar1DValue);
		this.resetVariable("TALENT", IntChar1DValue, 1000);
		this.resetVariable("EXP", IntChar1DValue);
		this.resetVariable("MARK", IntChar1DValue);
		this.resetVariable("RELATION", IntChar1DValue, 1000);
		this.resetVariable("JUEL", IntChar1DValue, 1000);
		this.resetVariable("CFLAG", IntChar1DValue, 1000);
		this.resetVariable("EQUIP", IntChar1DValue, 1000);
		this.resetVariable("TEQUIP", IntChar1DValue, 1000);
		this.resetVariable("PALAM", IntChar1DValue, 1000);
		this.resetVariable("STAIN", IntChar1DValue, 1000);
		this.resetVariable("EX", IntChar1DValue, 1000);
		this.resetVariable("SOURCE", IntChar1DValue, 1000);
		this.resetVariable("NOWEX", IntChar1DValue, 1000);
		this.resetVariable("GOTJUEL", IntChar1DValue, 1000);
		this.resetVariable("ABLNAME", Str1DValue);
		(this.globalMap.get("ABLNAME") as Str1DValue).reset(this, data.ability);
		this.resetVariable("TALENTNAME", Str1DValue);
		(this.globalMap.get("TALENTNAME") as Str1DValue).reset(this, data.talent);
		this.resetVariable("EXPNAME", Str1DValue);
		(this.globalMap.get("EXPNAME") as Str1DValue).reset(this, data.exp);
		this.resetVariable("MARKNAME", Str1DValue);
		(this.globalMap.get("MARKNAME") as Str1DValue).reset(this, data.mark);
		this.resetVariable("PALAMNAME", Str1DValue);
		(this.globalMap.get("PALAMNAME") as Str1DValue).reset(this, data.palam);
		this.resetVariable("ITEMNAME", Str1DValue);
		(this.globalMap.get("ITEMNAME") as Str1DValue).reset(this, new Map(
			[...data.item.entries()].map(([key, val]) => [key, val.name]),
		));
		this.resetVariable("NOITEM", Int1DValue);
		this.resetVariable("LINECOUNT", Int0DValue);
		this.resetVariable("ISTIMEOUT", Int0DValue);
		this.resetVariable("__INT_MAX__", Int0DValue, Int0DValue.from(2 ** 32 - 1));
		this.resetVariable("__INT_MIN__", Int0DValue, Int0DValue.from(-(2 ** 32 - 1)));
		this.resetVariable("RANDDATA", Int0DValue, Int0DValue.from(this.random.state));
		this.resetVariable("TSTR", Str1DValue);
		this.resetVariable("NICKNAME", StrChar0DValue);
		this.resetVariable("MASTERNAME", StrChar0DValue);
		this.resetVariable("DOWNBASE", IntChar1DValue, 1000);
		this.resetVariable("CUP", IntChar1DValue, 1000);
		this.resetVariable("CDOWN", IntChar1DValue, 1000);
		this.resetVariable("TCVAR", IntChar1DValue, 1000);
		this.resetVariable("CSTR", StrChar1DValue);
		this.resetVariable("ITEMPRICE", Int1DValue);
		(this.globalMap.get("ITEMPRICE") as Int1DValue).reset(this, new Map(
			[...data.item.entries()].map(([key, val]) => [key, val.price]),
		));
		this.resetVariable("TRAINNAME", Str1DValue);
		(this.globalMap.get("TRAINNAME") as Str1DValue).reset(this, data.train);
		this.resetVariable("BASENAME", Str1DValue);
		this.resetVariable("EQUIPNAME", Str1DValue);
		this.resetVariable("TEQUIPNAME", Str1DValue);
		this.resetVariable("STAINNAME", Str1DValue);
		this.resetVariable("EXNAME", Str1DValue);
		this.resetVariable("SOURCENAME", Str1DValue);
		this.resetVariable("FLAGNAME", Str1DValue);
		this.resetVariable("TFLAGNAME", Str1DValue);
		this.resetVariable("CFLAGNAME", Str1DValue);
		this.resetVariable("TCVARNAME", Str1DValue);
		this.resetVariable("STRNAME", Str1DValue);
		this.resetVariable("TSTRNAME", Str1DValue);
		this.resetVariable("CSTRNAME", Str1DValue);
		this.resetVariable("SAVESTRNAME", Str1DValue);
		this.resetVariable("CDFLAGNAME1", Str1DValue);
		this.resetVariable("CDFLAGNAME2", Str1DValue);
		this.resetVariable("GLOBALNAME", Str1DValue);
		this.resetVariable("GLOBALSNAME", Str1DValue);
		this.resetVariable("GAMEBASE_AUTHOR", Str0DValue, Str0DValue.from(
			data.gamebase.author ?? "",
		));
		this.resetVariable("GAMEBASE_INFO", Str0DValue, Str0DValue.from(data.gamebase.info ?? ""));
		this.resetVariable("GAMEBASE_YEAR", Str0DValue, Str0DValue.from(data.gamebase.year ?? ""));
		this.resetVariable("GAMEBASE_TITLE", Str0DValue, Str0DValue.from(
			data.gamebase.title ?? "",
		));
		this.resetVariable("GAMEBASE_VERSION", Int0DValue, Int0DValue.from(
			data.gamebase.version ?? 0,
		));
		this.resetVariable("GAMEBASE_ALLOWVERSION", Int0DValue);
		this.resetVariable("GAMEBASE_DEFAULTCHARA", Int0DValue);
		this.resetVariable("GAMEBASE_NOITEM", Int0DValue);
		this.resetVariable("WINDOW_TITLE", Str0DValue);
		this.resetVariable("MONEYLABEL", Str0DValue);
		this.resetVariable("LASTLOAD_VERSION", Int0DValue, Int0DValue.from(-1));
		this.resetVariable("LASTLOAD_NO", Int0DValue, Int0DValue.from(-1));
		this.resetVariable("LASTLOAD_TEXT", Str0DValue);
		this.resetVariable("SAVEDATA_TEXT", Str0DValue);
		this.resetVariable("CTRAIN_COUNT", Int0DValue);
		for (const i of data.ability.keys()) {
			this.resetVariable(data.ability.get(i)!, Int0DValue, Int0DValue.from(i));
		}
		for (const i of data.exp.keys()) {
			this.resetVariable(data.exp.get(i)!, Int0DValue, Int0DValue.from(i));
		}
		for (const i of data.item.keys()) {
			this.resetVariable(data.item.get(i)!.name, Int0DValue, Int0DValue.from(i));
		}
		for (const i of data.talent.keys()) {
			this.resetVariable(data.talent.get(i)!, Int0DValue, Int0DValue.from(i));
		}
		for (const i of data.mark.keys()) {
			this.resetVariable(data.mark.get(i)!, Int0DValue, Int0DValue.from(i));
		}
		for (const i of data.palam.keys()) {
			this.resetVariable(data.palam.get(i)!, Int0DValue, Int0DValue.from(i));
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
		for (const fnValues of this.fnMap.values()) {
			for (const fn of fnValues) {
				// TODO: Initialize staticMap only once
				this.staticMap.set(fn.name, new Map());
				this.staticMap.get(fn.name)!.set("LOCAL", new Int1DValue(1000));
				this.staticMap.get(fn.name)!.set("LOCALS", new Str1DValue(100));
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
		}
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
		context.dynamicMap.set("ARG", new Int1DValue(1000));
		context.dynamicMap.set("ARGS", new Str1DValue(100));
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

	public getValue<T extends Value>(name: string): T {
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

	public *start(): ReturnType<Statement["run"]> {
		let begin = "TITLE";
		while (true) {
			let result: Result | null = null;
			switch (begin.toUpperCase()) {
				case "TITLE": result = yield* scene.TITLE.run(this); break;
				case "FIRST": result = yield* scene.FIRST.run(this); break;
				case "SHOP": result = yield* scene.SHOP.run(this); break;
				case "TRAIN": result = yield* scene.TRAIN.run(this); break;
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
}
