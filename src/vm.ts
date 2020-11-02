import {assertNumber, assertString} from "./assert";
import {Character, Config} from "./config";
import type Fn from "./fn";
import NDArray, {Leaf} from "./ndarray";
import type Property from "./property";
import Dim from "./property/dim";
import DimS from "./property/dims";
import LocalSize from "./property/localsize";
import LocalSSize from "./property/localssize";
import type {default as Statement, Result} from "./statement";
import type Alignment from "./statement/command/alignment";
import Call from "./statement/command/call";

/* eslint-disable array-bracket-newline */
const CHAR_VAR_ARRAY = [
	"CFLAG", "TALENT", "MAXBASE", "BASE", "ABL", "EXP", "CSTR", "MARK", "PALAM", "JUEL",
];
/* eslint-enable array-bracket-newline */
const CHAR_VAR_SINGLE = ["NAME", "CALLNAME", "NO"];

type Context = {
	fn: string;
	dynamicMap: Map<string, NDArray>;
};

export default class VM {
	public fnMap: Map<string, Fn[]>;
	public characterMap: Map<number, Character>;

	public globalMap: Map<string, NDArray>;
	public staticMap: Map<string, Map<string, NDArray>>;
	private contextStack: Array<Context>;

	public characters: Character[];
	public alignment: Alignment["align"];
	public font: {
		name: string;
		bold: boolean;
	};
	public color: {
		front: {
			r: number;
			g: number;
			b: number;
		};
	};

	public constructor(header: Property[], fnList: Fn[], config: Config) {
		this.fnMap = new Map();
		this.characterMap = new Map();
		this.globalMap = new Map();
		this.staticMap = new Map();
		this.contextStack = [];
		this.characters = [];
		this.alignment = "left";
		this.font = {
			name: "",
			bold: false,
		};
		this.color = {
			front: {
				r: 255,
				g: 255,
				b: 255,
			},
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

		for (const [id, character] of config.character) {
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
		this.globalMap.set("MONEY", new NDArray("number", []));
		this.globalMap.set("TARGET", new NDArray("number", [], -1));
		this.globalMap.set("FLAG", new NDArray("number", [10000]));
		this.globalMap.set("ITEMSALES", new NDArray("number", [100]));
		this.globalMap.set("BOUGHT", new NDArray("number", []));
		this.globalMap.set("PBAND", new NDArray("number", [], 4));
		this.globalMap.set("CHARANUM", new NDArray("number", []));
		this.globalMap.set("SAVESTR", new NDArray("string", [100]));
		this.globalMap.set("ABLNAME", NDArray.fromValue("string", config.ability));
		this.globalMap.set("TALENTNAME", NDArray.fromValue("string", config.talent));
		this.globalMap.set("EXPNAME", NDArray.fromValue("string", config.exp));
		this.globalMap.set("MARKNAME", NDArray.fromValue("string", config.mark));
		this.globalMap.set("PALAMNAME", NDArray.fromValue("string", config.palam));
		this.globalMap.set("GLOBAL", new NDArray("number", [1000]));
		this.globalMap.set("GLOBALS", new NDArray("string", [100]));
		this.globalMap.set("GAMEBASE_AUTHOR", new NDArray("string", [], config.gamebase.author));
		this.globalMap.set("GAMEBASE_INFO", new NDArray("string", [], config.gamebase.info));
		this.globalMap.set("GAMEBASE_YEAR", new NDArray("string", [], config.gamebase.year));
		this.globalMap.set("GAMEBASE_TITLE", new NDArray("string", [], config.gamebase.title));
		this.globalMap.set("GAMEBASE_VERSION", new NDArray("number", [], config.gamebase.version));
		this.globalMap.set("LINECOUNT", new NDArray("number", []));
		for (let i = 0; i < config.ability.length; ++i) {
			if (config.ability[i] !== "") {
				this.globalMap.set(config.ability[i], new NDArray("number", [], i));
			}
		}
		for (let i = 0; i < config.talent.length; ++i) {
			if (config.talent[i] !== "") {
				this.globalMap.set(config.talent[i], new NDArray("number", [], i));
			}
		}
		for (let i = 0; i < config.exp.length; ++i) {
			if (config.exp[i] !== "") {
				this.globalMap.set(config.exp[i], new NDArray("number", [], i));
			}
		}
		for (let i = 0; i < config.mark.length; ++i) {
			if (config.mark[i] !== "") {
				this.globalMap.set(config.mark[i], new NDArray("number", [], i));
			}
		}
		for (let i = 0; i < config.palam.length; ++i) {
			if (config.palam[i] !== "") {
				this.globalMap.set(config.palam[i], new NDArray("number", [], i));
			}
		}

		for (const property of header) {
			if (property instanceof Dim || property instanceof DimS) {
				property.apply(this.globalMap);
			}
		}

		for (const fn of this.fnMap.keys()) {
			this.staticMap.set(fn, new Map());
			this.staticMap.get(fn)!.set("LOCAL", new NDArray("number", [1000]));
			this.staticMap.get(fn)!.set("LOCALS", new NDArray("string", [100]));
		}

		for (const fnValues of this.fnMap.values()) {
			for (const fn of fnValues) {
				for (const property of fn.property) {
					if (property instanceof LocalSize || property instanceof LocalSSize) {
						property.apply(this, fn.name);
					}
				}
			}
		}
	}

	private context(): Context {
		return this.contextStack[this.contextStack.length - 1];
	}

	public pushContext(fn: Fn): void {
		const context: Context = {
			fn: fn.name,
			dynamicMap: new Map(),
		};
		context.dynamicMap.set("ARG", new NDArray("number", [1000]));
		context.dynamicMap.set("ARGS", new NDArray("string", [100]));
		for (const property of fn.property) {
			if (property instanceof Dim || property instanceof DimS) {
				property.apply(context.dynamicMap);
			}
		}

		this.contextStack.push(context);
	}

	public popContext(): void {
		this.contextStack.pop();
	}

	public getValue(name: string, ...index: number[]): Leaf {
		const context = this.context();
		if (CHAR_VAR_ARRAY.includes(name)) {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const charIndex = index[1] != null ? index[0] : this.getValue("TARGET");
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const valIndex = index[1] != null ? index[1] : index[0];
			assertNumber(charIndex, "Character index should an integer");
			assertNumber(valIndex, "Index for character variable should be an integer");

			const character = this.characters[charIndex];
			switch (name) {
				case "CFLAG": return character.flags[valIndex];
				case "TALENT": return character.talent[valIndex];
				case "MAXBASE": return character.maxBase[valIndex];
				case "BASE": return character.base[valIndex];
				case "ABL": return character.abilities[valIndex];
				case "EXP": return character.exp[valIndex];
				case "CSTR": return character.cstr[valIndex];
				case "MARK": return character.mark[valIndex];
				case "PALAM": return character.palam[valIndex];
				case "JUEL": return character.juel[valIndex];
				default: throw new Error("Unreachable");
			}
		} else if (CHAR_VAR_SINGLE.includes(name)) {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const charIndex = index[0] ?? this.getValue("TARGET");
			assertNumber(charIndex, "Character index should an integer");

			const character = this.characters[charIndex];
			switch (name) {
				case "NO": return character.id;
				case "NAME": return character.name;
				case "CALLNAME": return character.nickname;
				default: throw new Error("Unreachable");
			}
		} else if (name === "RAND") {
			assertNumber(index[0], "1st index of variable RAND should be an integer");
			return Math.floor(Math.random() * index[0]);
		} else if (context.dynamicMap.has(name)) {
			return context.dynamicMap.get(name)!.get(...index, 0);
		} else if (this.staticMap.get(context.fn)!.has(name)) {
			return this.staticMap.get(context.fn)!.get(name)!.get(...index, 0);
		} else if (this.globalMap.has(name)) {
			return this.globalMap.get(name)!.get(...index, 0);
		} else {
			throw new Error(`Variable ${name} does not exist`);
		}
	}

	public setValue(value: Leaf, name: string, ...index: number[]): void {
		const context = this.context();
		if (CHAR_VAR_ARRAY.includes(name)) {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const charIndex = index[1] != null ? index[0] : this.getValue("TARGET");
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const valIndex = index[1] != null ? index[1] : index[0];
			assertNumber(charIndex, "Character index should an integer");
			assertNumber(valIndex, "Index for character variable should be an integer");

			const character = this.characters[charIndex];
			switch (name) {
				case "CFLAG": {
					assertNumber(value, "Value for CFLAG should be an integer");
					character.flags[valIndex] = value;
					break;
				}
				case "TALENT": {
					assertNumber(value, "Value for TALENT should be an integer");
					character.talent[valIndex] = value;
					break;
				}
				case "MAXBASE": {
					assertNumber(value, "Value for MAXBASE should be an integer");
					character.maxBase[valIndex] = value;
					break;
				}
				case "BASE": {
					assertNumber(value, "Value for BASE should be an integer");
					character.base[valIndex] = value;
					break;
				}
				case "ABL": {
					assertNumber(value, "Value for ABL should be an integer");
					character.abilities[valIndex] = value;
					break;
				}
				case "EXP": {
					assertNumber(value, "Value for EXP should be an integer");
					character.exp[valIndex] = value;
					break;
				}
				case "CSTR": {
					assertString(value, "Value for CSTR should be a string");
					character.cstr[valIndex] = value;
					break;
				}
				case "MARK": {
					assertNumber(value, "Value for MARK should be an integer");
					character.mark[valIndex] = value;
					break;
				}
				case "PALAM": {
					assertNumber(value, "Value for PALAM should be an integer");
					character.palam[valIndex] = value;
					break;
				}
				case "JUEL": {
					assertNumber(value, "Value for JUEL should be an integer");
					character.juel[valIndex] = value;
					break;
				}
				default: throw new Error("Unreachable");
			}
		} else if (CHAR_VAR_SINGLE.includes(name)) {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			const charIndex = index[0] ?? this.getValue("TARGET");
			assertNumber(charIndex, "Character index should an integer");

			const character = this.characters[charIndex];
			switch (name) {
				case "NO": {
					assertNumber(value, "Value for NO should be a number");
					character.id = value;
					break;
				}
				case "NAME": {
					assertString(value, "Value for NAME should be a string");
					character.name = value;
					break;
				}
				case "CALLNAME": {
					assertString(value, "Value for CALLNAME should be a string");
					character.nickname = value;
					break;
				}
				default: throw new Error("Unreachable");
			}
		} else if (context.dynamicMap.has(name)) {
			context.dynamicMap.get(name)!.set(value, ...index, 0);
		} else if (this.staticMap.get(context.fn)!.has(name)) {
			this.staticMap.get(context.fn)!.get(name)!.set(value, ...index, 0);
		} else if (this.globalMap.has(name)) {
			this.globalMap.get(name)!.set(value, ...index, 0);
		} else {
			throw new Error(`Variable ${name} does not exist`);
		}
	}

	public lengthOf(name: string, depth: 0 | 1 | 2): number {
		const context = this.context();
		if (context.dynamicMap.has(name)) {
			return context.dynamicMap.get(name)!.length(depth);
		} else if (this.staticMap.get(context.fn)!.has(name)) {
			return this.staticMap.get(context.fn)!.get(name)!.length(depth);
		} else if (this.globalMap.has(name)) {
			return this.globalMap.get(name)!.length(depth);
		} else {
			throw new Error(`Cannot get length of variable ${name}`);
		}
	}

	public typeof(name: string): NDArray["type"] {
		const context = this.context();
		if (name === "CFLAG") {
			return "number";
		} else if (name === "TALENT") {
			return "number";
		} else if (name === "EXP") {
			return "number";
		} else if (name === "MAXBASE") {
			return "number";
		} else if (name === "BASE") {
			return "number";
		} else if (name === "ABL") {
			return "number";
		} else if (name === "CSTR") {
			return "string";
		} else if (name === "MARK") {
			return "number";
		} else if (name === "PALAM") {
			return "number";
		} else if (name === "JUEL") {
			return "number";
		} else if (name === "NO") {
			return "number";
		} else if (name === "RAND") {
			return "number";
		} else if (context.dynamicMap.has(name)) {
			return context.dynamicMap.get(name)!.type;
		} else if (this.staticMap.get(context.fn)!.has(name)) {
			return this.staticMap.get(context.fn)!.get(name)!.type;
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
			switch (begin) {
				case "TITLE": {
					result = yield* new Call("SYSTEM_TITLE", []).run(this);
					break;
				}
				case "FIRST": {
					result = yield* new Call("EVENTFIRST", []).run(this);
					break;
				}
				default: {
					throw new Error(`${begin} is not a valid keyword`);
				}
			}

			switch (result?.type) {
				case "begin": begin = result.keyword; continue;
				case "goto": throw new Error(`Label ${result.label} not found`);
				case "break": return null;
				case "continue": return null;
				case undefined: continue;
			}
		}
	}
}
