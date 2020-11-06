import {assertNumber} from "./assert";
import type Config from "./config";
import * as color from "./color";
import type Color from "./color";
import {Character, Data} from "./data";
import Fn from "./fn";
import NDArray, {Leaf} from "./ndarray";
import type Property from "./property";
import Dim from "./property/dim";
import DimDynamic from "./property/dim-dynamic";
import LocalSize from "./property/localsize";
import LocalSSize from "./property/localssize";
import type {default as Statement, Result} from "./statement";
import type Alignment from "./statement/command/alignment";
import * as scene from "./scene";
import Thunk from "./thunk";

const CHAR_VAR_0D = ["NO", "NAME", "CALLNAME"];
/* eslint-disable array-bracket-newline */
const CHAR_VAR_1D = [
	"CFLAG", "TALENT", "MAXBASE", "BASE", "ABL", "EXP", "CSTR", "MARK", "PALAM", "JUEL",
];
/* eslint-enable array-bracket-newline */

type Context = {
	fn: Fn;
	dynamicMap: Map<string, NDArray>;
	refMap: Map<string, string>;
};

export default class VM {
	public fnMap: Map<string, Fn[]>;
	public characterMap: Map<number, Character>;

	public globalMap: Map<string, NDArray>;
	public staticMap: Map<string, Map<string, NDArray>>;
	private contextStack: Array<Context>;

	public alignment: Alignment["align"];
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
		this.alignment = "left";
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

		this.globalMap.set("RESULT", new NDArray("number", [1000]));
		this.globalMap.set("RESULTS", new NDArray("string", [100]));
		this.globalMap.set("A", new NDArray("number", []));
		this.globalMap.set("B", new NDArray("number", []));
		this.globalMap.set("C", new NDArray("number", []));
		this.globalMap.set("D", new NDArray("number", []));
		this.globalMap.set("E", new NDArray("number", []));
		this.globalMap.set("F", new NDArray("number", []));
		this.globalMap.set("G", new NDArray("number", []));
		this.globalMap.set("H", new NDArray("number", []));
		this.globalMap.set("I", new NDArray("number", []));
		this.globalMap.set("J", new NDArray("number", []));
		this.globalMap.set("K", new NDArray("number", []));
		this.globalMap.set("L", new NDArray("number", []));
		this.globalMap.set("M", new NDArray("number", []));
		this.globalMap.set("N", new NDArray("number", []));
		this.globalMap.set("O", new NDArray("number", []));
		this.globalMap.set("P", new NDArray("number", []));
		this.globalMap.set("Q", new NDArray("number", []));
		this.globalMap.set("R", new NDArray("number", []));
		this.globalMap.set("S", new NDArray("number", []));
		this.globalMap.set("T", new NDArray("number", []));
		this.globalMap.set("U", new NDArray("number", []));
		this.globalMap.set("V", new NDArray("number", []));
		this.globalMap.set("W", new NDArray("number", []));
		this.globalMap.set("X", new NDArray("number", []));
		this.globalMap.set("Y", new NDArray("number", []));
		this.globalMap.set("Z", new NDArray("number", []));
		this.globalMap.set("COUNT", new NDArray("number", []));
		this.globalMap.set("DAY", new NDArray("number", []));
		this.globalMap.set("TIME", new NDArray("number", []));
		this.globalMap.set("MONEY", new NDArray("number", []));
		this.globalMap.set("MASTER", new NDArray("number", [], 0));
		this.globalMap.set("TARGET", new NDArray("number", [], -1));
		this.globalMap.set("ASSI", new NDArray("number", [], -1));
		this.globalMap.set("PLAYER", new NDArray("number", []));
		this.globalMap.set("ASSIPLAY", new NDArray("number", []));
		this.globalMap.set("SELECTCOM", new NDArray("number", [1000]));
		this.globalMap.set("PREVCOM", new NDArray("number", []));
		this.globalMap.set("NEXTCOM", new NDArray("number", []));
		this.globalMap.set("LOSEBASE", new NDArray("number", [1000]));
		this.globalMap.set("UP", new NDArray("number", [1000]));
		this.globalMap.set("DOWN", new NDArray("number", [1000]));
		this.globalMap.set("PALAMLV", NDArray.fromValue(
			"number",
			[0, 100, 500, 3000, 10000, 30000, 60000, 100000, 150000, 250000],
		));
		this.globalMap.set("EXPLV", NDArray.fromValue(
			"number",
			[0, 1, 4, 20, 50, 200],
		));
		this.globalMap.set("EJAC", new NDArray("number", [], 10000));
		this.globalMap.set("FLAG", new NDArray("number", [10000]));
		this.globalMap.set("TFLAG", new NDArray("number", [1000]));
		this.globalMap.set("ITEMSALES", new NDArray("number", [100]));
		this.globalMap.set("BOUGHT", new NDArray("number", []));
		this.globalMap.set("PBAND", new NDArray("number", [], 4));
		this.globalMap.set("CHARANUM", new NDArray("number", []));
		this.globalMap.set("SAVESTR", new NDArray("string", [100]));
		this.globalMap.set("NO", new NDArray("number", [1000]));
		this.globalMap.set("NAME", new NDArray("string", [1000]));
		this.globalMap.set("CALLNAME", new NDArray("string", [1000]));
		this.globalMap.set("CFLAG", new NDArray("number", [1000, 1000]));
		this.globalMap.set("TALENT", new NDArray("number", [1000, 1000]));
		this.globalMap.set("MAXBASE", new NDArray("number", [1000, 100]));
		this.globalMap.set("BASE", new NDArray("number", [1000, 100]));
		this.globalMap.set("ABL", new NDArray("number", [1000, 100]));
		this.globalMap.set("EXP", new NDArray("number", [1000, 100]));
		this.globalMap.set("CSTR", new NDArray("string", [1000, 100]));
		this.globalMap.set("MARK", new NDArray("number", [1000, 100]));
		this.globalMap.set("PALAM", new NDArray("number", [1000, 200]));
		this.globalMap.set("JUEL", new NDArray("number", [1000, 200]));
		this.globalMap.set("EQUIP", new NDArray("number", [1000, 1000]));
		this.globalMap.set("TEQUIP", new NDArray("number", [1000, 1000]));
		this.globalMap.set("STAIN", new NDArray("number", [1000, 1000]));
		this.globalMap.set("EX", new NDArray("number", [1000, 1000]));
		this.globalMap.set("SOURCE", new NDArray("number", [1000, 1000]));
		this.globalMap.set("NOWEX", new NDArray("number", [1000, 1000]));
		this.globalMap.set("GOTJUEL", new NDArray("number", [1000, 1000]));
		this.globalMap.set("ITEM", new NDArray("number", [1000]));
		this.globalMap.set("ITEMSALES", new NDArray("number", [1000]));
		this.globalMap.set("ABLNAME", NDArray.fromValue("string", data.ability));
		this.globalMap.set("TALENTNAME", NDArray.fromValue("string", data.talent));
		this.globalMap.set("EXPNAME", NDArray.fromValue("string", data.exp));
		this.globalMap.set("ITEMNAME", NDArray.fromValue("string", data.item));
		this.globalMap.set("MARKNAME", NDArray.fromValue("string", data.mark));
		this.globalMap.set("PALAMNAME", NDArray.fromValue("string", data.palam));
		this.globalMap.set("TRAINNAME", NDArray.fromValue("string", data.train));
		this.globalMap.set("GLOBAL", new NDArray("number", [1000]));
		this.globalMap.set("GLOBALS", new NDArray("string", [100]));
		this.globalMap.set("GAMEBASE_AUTHOR", new NDArray("string", [], data.gamebase.author));
		this.globalMap.set("GAMEBASE_INFO", new NDArray("string", [], data.gamebase.info));
		this.globalMap.set("GAMEBASE_YEAR", new NDArray("string", [], data.gamebase.year));
		this.globalMap.set("GAMEBASE_TITLE", new NDArray("string", [], data.gamebase.title));
		this.globalMap.set("GAMEBASE_VERSION", new NDArray("number", [], data.gamebase.version));
		this.globalMap.set("LINECOUNT", new NDArray("number", []));
		this.globalMap.set("CTRAIN_COUNT", new NDArray("number", []));
		for (let i = 0; i < data.ability.length; ++i) {
			if (data.ability[i] !== "") {
				this.globalMap.set(data.ability[i], new NDArray("number", [], i));
			}
		}
		for (let i = 0; i < data.exp.length; ++i) {
			if (data.exp[i] !== "") {
				this.globalMap.set(data.exp[i], new NDArray("number", [], i));
			}
		}
		for (let i = 0; i < data.item.length; ++i) {
			if (data.item[i] !== "") {
				this.globalMap.set(data.item[i], new NDArray("number", [], i));
			}
		}
		for (let i = 0; i < data.talent.length; ++i) {
			if (data.talent[i] !== "") {
				this.globalMap.set(data.talent[i], new NDArray("number", [], i));
			}
		}
		for (let i = 0; i < data.mark.length; ++i) {
			if (data.mark[i] !== "") {
				this.globalMap.set(data.mark[i], new NDArray("number", [], i));
			}
		}
		for (let i = 0; i < data.palam.length; ++i) {
			if (data.palam[i] !== "") {
				this.globalMap.set(data.palam[i], new NDArray("number", [], i));
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
				this.staticMap.get(fn.name)!.set("LOCAL", new NDArray("number", [1000]));
				this.staticMap.get(fn.name)!.set("LOCALS", new NDArray("string", [100]));
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
		context.dynamicMap.set("ARG", new NDArray("number", [1000]));
		context.dynamicMap.set("ARGS", new NDArray("string", [100]));
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

	public getValue(name: string, ...index: number[]): Leaf {
		const context = this.context();
		if (name === "RAND") {
			assertNumber(index[0], "1st index of variable RAND should be an integer");
			return Math.floor(Math.random() * index[0]);
		} else if (CHAR_VAR_1D.includes(name)) {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const charIndex = index[1] != null ? index[0] : this.getValue("TARGET");
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const valIndex = index[1] != null ? index[1] : index[0];
			assertNumber(charIndex, "Character index should an integer");
			assertNumber(valIndex, "Index for character variable should be an integer");

			return this.globalMap.get(name)!.get(charIndex, valIndex);
		} else if (CHAR_VAR_0D.includes(name)) {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const charIndex = index[0] ?? this.getValue("TARGET");
			assertNumber(charIndex, "Character index should an integer");

			return this.globalMap.get(name)!.get(charIndex);
		} else if (context.refMap.has(name)) {
			return this.getValue(context.refMap.get(name)!, ...index);
		} else if (context.dynamicMap.has(name)) {
			return context.dynamicMap.get(name)!.get(...index, 0);
		} else if (this.staticMap.get(context.fn.name)!.has(name)) {
			return this.staticMap.get(context.fn.name)!.get(name)!.get(...index, 0);
		} else if (this.globalMap.has(name)) {
			return this.globalMap.get(name)!.get(...index, 0);
		} else {
			throw new Error(`Variable ${name} does not exist`);
		}
	}

	public setValue(value: Leaf, name: string, ...index: number[]): void {
		const context = this.context();
		if (CHAR_VAR_1D.includes(name)) {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const charIndex = index[1] != null ? index[0] : this.getValue("TARGET");
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const valIndex = index[1] != null ? index[1] : index[0];
			assertNumber(charIndex, "Character index should an integer");
			assertNumber(valIndex, "Index for character variable should be an integer");

			this.globalMap.get(name)!.set(value, charIndex, valIndex);
		} else if (CHAR_VAR_0D.includes(name)) {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const charIndex = index[0] ?? this.getValue("TARGET");
			assertNumber(charIndex, "Character index should an integer");

			this.globalMap.get(name)!.set(value, charIndex);
		} else if (context.refMap.has(name)) {
			this.setValue(value, context.refMap.get(name)!, ...index);
		} else if (context.dynamicMap.has(name)) {
			context.dynamicMap.get(name)!.set(value, ...index, 0);
		} else if (this.staticMap.get(context.fn.name)!.has(name)) {
			this.staticMap.get(context.fn.name)!.get(name)!.set(value, ...index, 0);
		} else if (this.globalMap.has(name)) {
			this.globalMap.get(name)!.set(value, ...index, 0);
		} else {
			throw new Error(`Variable ${name} does not exist`);
		}
	}

	public lengthOf(name: string, depth: 0 | 1 | 2): number {
		const context = this.context();
		if (context.refMap.has(name)) {
			return this.lengthOf(context.refMap.get(name)!, depth);
		} else if (context.dynamicMap.has(name)) {
			return context.dynamicMap.get(name)!.length(depth);
		} else if (this.staticMap.get(context.fn.name)!.has(name)) {
			return this.staticMap.get(context.fn.name)!.get(name)!.length(depth);
		} else if (this.globalMap.has(name)) {
			return this.globalMap.get(name)!.length(depth);
		} else {
			throw new Error(`Cannot get length of variable ${name}`);
		}
	}

	public removeAt(name: string, ...index: number[]) {
		const context = this.context();
		if (context.refMap.has(name)) {
			this.removeAt(context.refMap.get(name)!, ...index);
		} else if (context.dynamicMap.has(name)) {
			context.dynamicMap.get(name)!.removeAt(...index);
		} else if (this.staticMap.get(context.fn.name)!.has(name)) {
			this.staticMap.get(context.fn.name)!.get(name)!.removeAt(...index);
		} else if (this.globalMap.has(name)) {
			this.globalMap.get(name)!.removeAt(...index);
		} else {
			throw new Error(`Cannot get remove ${index.join(",")} of variable ${name}`);
		}
	}

	public typeof(name: string): NDArray["type"] {
		const context = this.context();
		if (name === "RAND") {
			return "number";
		} else if (context.refMap.has(name)) {
			return this.typeof(context.refMap.get(name)!);
		} else if (context.dynamicMap.has(name)) {
			return context.dynamicMap.get(name)!.type;
		} else if (this.staticMap.get(context.fn.name)!.has(name)) {
			return this.staticMap.get(context.fn.name)!.get(name)!.type;
		} else if (this.globalMap.has(name)) {
			return this.globalMap.get(name)!.type;
		} else {
			throw new Error(`Cannot get type of variable ${name}`);
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
