import type Config from "./config";
import * as color from "./color";
import type Color from "./color";
import {Character, Data} from "./data";
import Fn from "./fn";
import type Property from "./property";
import Dim from "./property/dim";
import DimDynamic from "./property/dim-dynamic";
import LocalSize from "./property/localsize";
import LocalSSize from "./property/localssize";
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
	public fnMap: Map<string, Fn[]>;
	public characterMap: Map<number, Character>;

	public globalMap: Map<string, Value>;
	public staticMap: Map<string, Map<string, Value>>;
	private contextStack: Array<Context>;

	public alignment: Align;
	public draw: boolean;
	public skipDisp: boolean;
	public font: {
		name: string;
		bold: boolean;
	};
	public color: {
		defaultFront: Color;
		defaultBack: Color;
		front: Color;
		back: Color;
		focus: Color;
	};

	public constructor(header: Property[], fnList: Fn[], data: Data) {
		this.fnMap = new Map();
		this.characterMap = new Map();
		this.globalMap = new Map();
		this.staticMap = new Map();
		this.contextStack = [];
		this.alignment = "LEFT";
		this.draw = true;
		this.skipDisp = false;
		this.font = {
			name: "",
			bold: false,
		};

		// Assign default colors
		this.color = {
			defaultFront: color.hex(0xFFFFFF),
			defaultBack: color.hex(0x000000),
			front: color.hex(0xFFFFFF),
			back: color.hex(0x000000),
			focus: color.hex(0xFFFF00),
		};

		for (const fn of fnList) {
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

		for (const [id, character] of data.character) {
			this.characterMap.set(id, character);
		}

		this.globalMap.set("RAND", new RandValue());
		this.globalMap.set("RESULT", new Int1DValue(1000));
		this.globalMap.set("RESULTS", new Str1DValue(100));
		this.globalMap.set("A", new Int1DValue(100));
		this.globalMap.set("B", new Int1DValue(100));
		this.globalMap.set("C", new Int1DValue(100));
		this.globalMap.set("D", new Int1DValue(100));
		this.globalMap.set("E", new Int1DValue(100));
		this.globalMap.set("F", new Int1DValue(100));
		this.globalMap.set("G", new Int1DValue(100));
		this.globalMap.set("H", new Int1DValue(100));
		this.globalMap.set("I", new Int1DValue(100));
		this.globalMap.set("J", new Int1DValue(100));
		this.globalMap.set("K", new Int1DValue(100));
		this.globalMap.set("L", new Int1DValue(100));
		this.globalMap.set("M", new Int1DValue(100));
		this.globalMap.set("N", new Int1DValue(100));
		this.globalMap.set("O", new Int1DValue(100));
		this.globalMap.set("P", new Int1DValue(100));
		this.globalMap.set("Q", new Int1DValue(100));
		this.globalMap.set("R", new Int1DValue(100));
		this.globalMap.set("S", new Int1DValue(100));
		this.globalMap.set("T", new Int1DValue(100));
		this.globalMap.set("U", new Int1DValue(100));
		this.globalMap.set("V", new Int1DValue(100));
		this.globalMap.set("W", new Int1DValue(100));
		this.globalMap.set("X", new Int1DValue(100));
		this.globalMap.set("Y", new Int1DValue(100));
		this.globalMap.set("Z", new Int1DValue(100));
		this.globalMap.set("COUNT", new Int0DValue());
		this.globalMap.set("DAY", new Int1DValue(1000));
		this.globalMap.set("TIME", new Int0DValue());
		this.globalMap.set("MONEY", new Int0DValue());
		this.globalMap.set("MASTER", new Int0DValue());
		this.globalMap.set("TARGET", Int0DValue.from(-1));
		this.globalMap.set("ASSI", Int0DValue.from(-1));
		this.globalMap.set("PLAYER", new Int0DValue());
		this.globalMap.set("ASSIPLAY", new Int0DValue());
		this.globalMap.set("SELECTCOM", new Int1DValue(1000));
		this.globalMap.set("PREVCOM", new Int0DValue());
		this.globalMap.set("NEXTCOM", new Int0DValue());
		this.globalMap.set("LOSEBASE", new Int1DValue(1000));
		this.globalMap.set("UP", new Int1DValue(1000));
		this.globalMap.set("DOWN", new Int1DValue(1000));
		this.globalMap.set("PALAMLV", Int1DValue.from(
			[0, 100, 500, 3000, 10000, 30000, 60000, 100000, 150000, 250000],
		));
		this.globalMap.set("EXPLV", Int1DValue.from([0, 1, 4, 20, 50, 200]));
		this.globalMap.set("EJAC", Int0DValue.from(10000));
		this.globalMap.set("FLAG", new Int1DValue(10000));
		this.globalMap.set("TFLAG", new Int1DValue(1000));
		this.globalMap.set("ITEM", new Int1DValue(1000));
		this.globalMap.set("ITEMSALES", new Int1DValue(1000));
		this.globalMap.set("BOUGHT", new Int0DValue());
		this.globalMap.set("PBAND", Int0DValue.from(4));
		this.globalMap.set("CHARANUM", new Int0DValue());
		this.globalMap.set("SAVESTR", new Str1DValue(100));
		this.globalMap.set("NO", new IntChar0DValue());
		this.globalMap.set("ISASSI", new IntChar0DValue());
		this.globalMap.set("NAME", new StrChar0DValue());
		this.globalMap.set("CALLNAME", new StrChar0DValue());
		this.globalMap.set("BASE", new IntChar1DValue(100));
		this.globalMap.set("MAXBASE", new IntChar1DValue(100));
		this.globalMap.set("ABL", new IntChar1DValue(100));
		this.globalMap.set("TALENT", new IntChar1DValue(1000));
		this.globalMap.set("EXP", new IntChar1DValue(100));
		this.globalMap.set("MARK", new IntChar1DValue(100));
		this.globalMap.set("RELATION", new IntChar1DValue(1000));
		this.globalMap.set("JUEL", new IntChar1DValue(1000));
		this.globalMap.set("CFLAG", new IntChar1DValue(1000));
		this.globalMap.set("EQUIP", new IntChar1DValue(1000));
		this.globalMap.set("TEQUIP", new IntChar1DValue(1000));
		this.globalMap.set("PALAM", new IntChar1DValue(1000));
		this.globalMap.set("STAIN", new IntChar1DValue(1000));
		this.globalMap.set("EX", new IntChar1DValue(1000));
		this.globalMap.set("SOURCE", new IntChar1DValue(1000));
		this.globalMap.set("NOWEX", new IntChar1DValue(1000));
		this.globalMap.set("GOTJUEL", new IntChar1DValue(1000));
		this.globalMap.set("ABLNAME", Str1DValue.from(data.ability));
		this.globalMap.set("TALENTNAME", Str1DValue.from(data.talent));
		this.globalMap.set("EXPNAME", Str1DValue.from(data.exp));
		this.globalMap.set("MARKNAME", Str1DValue.from(data.mark));
		this.globalMap.set("PALAMNAME", Str1DValue.from(data.palam));
		this.globalMap.set("ITEMNAME", Str1DValue.from(data.item));
		this.globalMap.set("NOITEM", new Int1DValue(1000));
		this.globalMap.set("GLOBAL", new Int1DValue(1000));
		this.globalMap.set("GLOBALS", new Str1DValue(100));
		this.globalMap.set("LINECOUNT", new Int0DValue());
		this.globalMap.set("ISTIMEOUT", new Int0DValue());
		this.globalMap.set("__INT_MAX__", Int0DValue.from(2 ** 32 - 1));
		this.globalMap.set("__INT_MIN__", Int0DValue.from(-(2 ** 32 - 1)));
		this.globalMap.set("RANDDATA", new Int1DValue(1000));
		this.globalMap.set("TSTR", new Str1DValue(100));
		// this.globalMap.set("DA", new Int2DValue(100, 100));
		// this.globalMap.set("DB", new Int2DValue(100, 100));
		// this.globalMap.set("DC", new Int2DValue(100, 100));
		// this.globalMap.set("DD", new Int2DValue(100, 100));
		// this.globalMap.set("DE", new Int2DValue(100, 100));
		// this.globalMap.set("DITEMTYPE", new Int2DValue(100, 100));
		// this.globalMap.set("TA", new Int3DValue(100, 100, 100));
		// this.globalMap.set("TB", new Int3DValue(100, 100, 100));
		this.globalMap.set("NICKNAME", new StrChar0DValue());
		this.globalMap.set("MASTERNAME", new StrChar0DValue());
		this.globalMap.set("DOWNBASE", new IntChar1DValue(1000));
		this.globalMap.set("CUP", new IntChar1DValue(1000));
		this.globalMap.set("CDOWN", new IntChar1DValue(1000));
		this.globalMap.set("TCVAR", new IntChar1DValue(1000));
		this.globalMap.set("CSTR", new StrChar1DValue(100));
		// this.globalMap.set("CDFLAG", new IntChar2DValue(100, 100));
		this.globalMap.set("ITEMPRICE", new Int1DValue(1000));
		this.globalMap.set("TRAINNAME", Str1DValue.from(data.train));
		this.globalMap.set("BASENAME", new Str1DValue(100));
		this.globalMap.set("EQUIPNAME", new Str1DValue(100));
		this.globalMap.set("TEQUIPNAME", new Str1DValue(100));
		this.globalMap.set("STAINNAME", new Str1DValue(100));
		this.globalMap.set("EXNAME", new Str1DValue(100));
		this.globalMap.set("SOURCENAME", new Str1DValue(100));
		this.globalMap.set("FLAGNAME", new Str1DValue(100));
		this.globalMap.set("TFLAGNAME", new Str1DValue(100));
		this.globalMap.set("CFLAGNAME", new Str1DValue(100));
		this.globalMap.set("TCVARNAME", new Str1DValue(100));
		this.globalMap.set("STRNAME", new Str1DValue(100));
		this.globalMap.set("TSTRNAME", new Str1DValue(100));
		this.globalMap.set("CSTRNAME", new Str1DValue(100));
		this.globalMap.set("SAVESTRNAME", new Str1DValue(100));
		this.globalMap.set("CDFLAGNAME1", new Str1DValue(100));
		this.globalMap.set("CDFLAGNAME2", new Str1DValue(100));
		this.globalMap.set("GLOBALNAME", new Str1DValue(100));
		this.globalMap.set("GLOBALSNAME", new Str1DValue(100));
		this.globalMap.set("GAMEBASE_AUTHOR", Str0DValue.from(data.gamebase.author ?? ""));
		this.globalMap.set("GAMEBASE_INFO", Str0DValue.from(data.gamebase.info ?? ""));
		this.globalMap.set("GAMEBASE_YEAR", Str0DValue.from(data.gamebase.year ?? ""));
		this.globalMap.set("GAMEBASE_TITLE", Str0DValue.from(data.gamebase.title ?? ""));
		this.globalMap.set("GAMEBASE_VERSION", Int0DValue.from(data.gamebase.version ?? 0));
		this.globalMap.set("GAMEBASE_ALLOWVERSION", new Int0DValue());
		this.globalMap.set("GAMEBASE_DEFAULTCHARA", new Int0DValue());
		this.globalMap.set("GAMEBASE_NOITEM", new Int0DValue());
		this.globalMap.set("WINDOW_TITLE", new Str0DValue());
		this.globalMap.set("MONEYLABEL", new Str0DValue());
		this.globalMap.set("LASTLOAD_VERSION", Int0DValue.from(-1));
		this.globalMap.set("LASTLOAD_NO", Int0DValue.from(-1));
		this.globalMap.set("LASTLOAD_TEXT", new Str0DValue());
		this.globalMap.set("SAVEDATA_TEXT", new Str0DValue());
		this.globalMap.set("CTRAIN_COUNT", new Int0DValue());
		for (let i = 0; i < data.ability.length; ++i) {
			if (data.ability[i] !== "") {
				this.globalMap.set(data.ability[i], Int0DValue.from(i));
			}
		}
		for (let i = 0; i < data.exp.length; ++i) {
			if (data.exp[i] !== "") {
				this.globalMap.set(data.exp[i], Int0DValue.from(i));
			}
		}
		for (let i = 0; i < data.item.length; ++i) {
			if (data.item[i] !== "") {
				this.globalMap.set(data.item[i], Int0DValue.from(i));
			}
		}
		for (let i = 0; i < data.talent.length; ++i) {
			if (data.talent[i] !== "") {
				this.globalMap.set(data.talent[i], Int0DValue.from(i));
			}
		}
		for (let i = 0; i < data.mark.length; ++i) {
			if (data.mark[i] !== "") {
				this.globalMap.set(data.mark[i], Int0DValue.from(i));
			}
		}
		for (let i = 0; i < data.palam.length; ++i) {
			if (data.palam[i] !== "") {
				this.globalMap.set(data.palam[i], Int0DValue.from(i));
			}
		}

		for (const property of header) {
			if (property instanceof Dim) {
				property.apply(this.globalMap);
			}
		}

		for (const fnValues of this.fnMap.values()) {
			for (const fn of fnValues) {
				this.staticMap.set(fn.name, new Map());
				this.staticMap.get(fn.name)!.set("LOCAL", new Int1DValue(1000));
				this.staticMap.get(fn.name)!.set("LOCALS", new Str1DValue(100));
				for (const property of fn.property) {
					if (property instanceof Dim) {
						property.apply(this.staticMap.get(fn.name)!);
					} else if (property instanceof LocalSize || property instanceof LocalSSize) {
						property.apply(this, fn.name);
					}
				}
			}
		}

		// Push dummy context for outermost call
		this.pushContext(new Fn("@DUMMY", [], [], new Thunk([])));
		this.staticMap.set("@DUMMY", new Map());
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
