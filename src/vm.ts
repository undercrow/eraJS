import {assert, assertNumber} from "./assert";
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
		this.globalMap.set("TALENTNAME", NDArray.fromValue("string", config.talent));
		this.globalMap.set("GLOBAL", new NDArray("number", [1000]));
		this.globalMap.set("GLOBALS", new NDArray("string", [100]));
		this.globalMap.set("GAMEBASE_AUTHOR", new NDArray("string", [], config.gamebase.author));
		this.globalMap.set("GAMEBASE_INFO", new NDArray("string", [], config.gamebase.info));
		this.globalMap.set("GAMEBASE_YEAR", new NDArray("string", [], config.gamebase.year));
		this.globalMap.set("GAMEBASE_TITLE", new NDArray("string", [], config.gamebase.title));
		this.globalMap.set("GAMEBASE_VERSION", new NDArray("number", [], config.gamebase.version));
		this.globalMap.set("LINECOUNT", new NDArray("number", []));
		for (let i = 0; i < config.talent.length; ++i) {
			this.globalMap.set(config.talent[i], new NDArray("number", [], i));
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
		if (name === "CFLAG") {
			assertNumber(index[0], "1st index of variable CFLAG should be an integer");
			assertNumber(index[1], "2nd index of variable CFLAG should be an integer");

			const character = this.characters[index[0]];
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			assert(character != null, `${index[0]}th character does not exist`);

			return character.flags[index[1]];
		} else if (name === "TALENT") {
			assertNumber(index[0], "1st index of variable TALENT should be an integer");
			assertNumber(index[1], "2nd index of variable TALENT should be an integer");

			const character = this.characters[index[0]];
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			assert(character != null, `${index[0]}th character does not exist`);

			return character.talent[index[1]];
		} else if (name === "EXP") {
			assertNumber(index[0], "1st index of variable EXP should be an integer");
			assertNumber(index[1], "2nd index of variable EXP should be an integer");

			const character = this.characters[index[0]];
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			assert(character != null, `${index[0]}th character does not exist`);

			return character.exp[index[1]];
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
		if (name === "CFLAG") {
			assertNumber(index[0], "1st index of variable CFLAG should be an integer");
			assertNumber(index[1], "2nd index of variable CFLAG should be an integer");
			assertNumber(value, "Value for CFLAG should be an integer");

			const character = this.characters[index[0]];
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			assert(character != null, `${index[0]}th character does not exist`);

			character.flags[index[1]] = value;
		} else if (name === "TALENT") {
			assertNumber(index[0], "1st index of variable TALENT should be an integer");
			assertNumber(index[1], "2nd index of variable TALENT should be an integer");
			assertNumber(value, "Value for TALENT should be an integer");

			const character = this.characters[index[0]];
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			assert(character != null, `${index[0]}th character does not exist`);

			character.talent[index[1]] = value;
		} else if (name === "EXP") {
			assertNumber(index[0], "1st index of variable EXP should be an integer");
			assertNumber(index[1], "2nd index of variable EXP should be an integer");
			assertNumber(value, "Value for EXP should be an integer");

			const character = this.characters[index[0]];
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			assert(character != null, `${index[0]}th character does not exist`);

			character.exp[index[1]] = value;
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
