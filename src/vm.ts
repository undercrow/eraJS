import {assert, assertNumber} from "./assert";
import {Character, Config} from "./config";
import type Fn from "./fn";
import type Property from "./property";
import Dim from "./property/dim";
import DimS from "./property/dims";
import LocalSize from "./property/localsize";
import LocalSSize from "./property/localssize";
import type {default as Statement, Result} from "./statement";
import type Alignment from "./statement/command/alignment";
import Call from "./statement/command/call";

export type LeafValue = string | number;
export type Value = LeafValue | LeafValue[] | LeafValue[][] | LeafValue[][][];

type Context = {
	fn: string;
	dynamicMap: Map<string, Value>;
};

export default class VM {
	public fnMap: Map<string, Fn[]>;
	public characterMap: Map<number, Character>;

	public globalMap: Map<string, Value>;
	public staticMap: Map<string, Map<string, Value>>;
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

		this.globalMap.set("RESULT", Array(1000).fill(0));
		this.globalMap.set("RESULTS", Array(100).fill(""));
		this.globalMap.set("A", 0);
		this.globalMap.set("B", 0);
		this.globalMap.set("C", 0);
		this.globalMap.set("D", 0);
		this.globalMap.set("E", 0);
		this.globalMap.set("F", 0);
		this.globalMap.set("G", 0);
		this.globalMap.set("H", 0);
		this.globalMap.set("I", 0);
		this.globalMap.set("J", 0);
		this.globalMap.set("K", 0);
		this.globalMap.set("L", 0);
		this.globalMap.set("M", 0);
		this.globalMap.set("N", 0);
		this.globalMap.set("O", 0);
		this.globalMap.set("P", 0);
		this.globalMap.set("Q", 0);
		this.globalMap.set("R", 0);
		this.globalMap.set("S", 0);
		this.globalMap.set("T", 0);
		this.globalMap.set("U", 0);
		this.globalMap.set("V", 0);
		this.globalMap.set("W", 0);
		this.globalMap.set("X", 0);
		this.globalMap.set("Y", 0);
		this.globalMap.set("Z", 0);
		this.globalMap.set("COUNT", 0);
		this.globalMap.set("DAY", 0);
		this.globalMap.set("MONEY", 0);
		this.globalMap.set("TARGET", -1);
		this.globalMap.set("FLAG", Array(10000).fill(0));
		this.globalMap.set("ITEMSALES", Array(100).fill(0));
		this.globalMap.set("BOUGHT", 0);
		this.globalMap.set("PBAND", 4);
		this.globalMap.set("CHARANUM", 0);
		this.globalMap.set("SAVESTR", Array(100).fill(""));
		this.globalMap.set("TALENTNAME", config.talent);
		this.globalMap.set("GLOBAL", Array(1000).fill(0));
		this.globalMap.set("GLOBALS", Array(100).fill(""));
		this.globalMap.set("GAMEBASE_AUTHOR", config.gamebase.author ?? "");
		this.globalMap.set("GAMEBASE_INFO", config.gamebase.info ?? "");
		this.globalMap.set("GAMEBASE_YEAR", config.gamebase.year ?? "");
		this.globalMap.set("GAMEBASE_TITLE", config.gamebase.title ?? "");
		this.globalMap.set("GAMEBASE_VERSION", config.gamebase.version ?? 0);
		this.globalMap.set("LINECOUNT", 0);
		for (let i = 0; i < config.talent.length; ++i) {
			this.globalMap.set(config.talent[i], i);
		}

		for (const property of header) {
			if (property instanceof Dim || property instanceof DimS) {
				property.apply(this.globalMap);
			}
		}

		for (const fn of this.fnMap.keys()) {
			this.staticMap.set(fn, new Map());
			this.staticMap.get(fn)!.set("LOCAL", Array(1000).fill(0));
			this.staticMap.get(fn)!.set("LOCALS", Array(100).fill(""));
		}

		for (const fnValues of this.fnMap.values()) {
			for (const fn of fnValues) {
				for (const property of fn.property) {
					if (property instanceof LocalSize) {
						this.staticMap.get(fn.name)!.set("LOCAL", Array(property.size).fill(0));
					} else if (property instanceof LocalSSize) {
						this.staticMap.get(fn.name)!.set("LOCALS", Array(property.size).fill(0));
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
		context.dynamicMap.set("ARG", Array(1000).fill(0));
		context.dynamicMap.set("ARGS", Array(100).fill(""));
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

	public getValue(name: string, ...index: number[]): LeafValue {
		const context = this.context();
		function get(value: Value) {
			if (Array.isArray(value)) {
				assertNumber(index[0], `1st index of variable ${name} should be an integer`);
				const depth1 = value[index[0]];
				if (Array.isArray(depth1)) {
					assertNumber(index[1], `2nd index of variable ${name} should be an integer`);
					const depth2 = depth1[index[1]];
					if (Array.isArray(depth2)) {
						assertNumber(
							index[2],
							`3rd index of variable ${name} should be an integer`,
						);
						return depth2[index[2]];
					} else {
						return depth2;
					}
				} else {
					return depth1;
				}
			} else {
				return value;
			}
		}

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
		} else if (context.dynamicMap.has(name)) {
			return get(context.dynamicMap.get(name)!);
		} else if (this.staticMap.get(context.fn)!.has(name)) {
			return get(this.staticMap.get(context.fn)!.get(name)!);
		} else if (this.globalMap.has(name)) {
			return get(this.globalMap.get(name)!);
		} else {
			throw new Error(`Variable ${name} does not exist`);
		}
	}

	public setValue(value: LeafValue, name: string, ...index: number[]): void {
		const context = this.context();
		function update(map: Map<string, Value>) {
			const dest = map.get(name)!;
			if (Array.isArray(dest)) {
				assertNumber(index[0], `1st index of variable ${name} should be an integer`);
				const depth1 = dest[index[0]];
				if (Array.isArray(depth1)) {
					assertNumber(index[1], `2nd index of variable ${name} should be an integer`);
					const depth2 = depth1[index[1]];
					if (Array.isArray(depth2)) {
						assertNumber(
							index[2],
							`3rd index of variable ${name} should be an integer`,
						);
						depth2[index[2]] = value;
					} else {
						depth1[index[1]] = value;
					}
				} else {
					dest[index[0]] = value;
				}
			} else {
				map.set(name, value);
			}
		}


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
		} else if (context.dynamicMap.has(name)) {
			update(context.dynamicMap);
		} else if (this.staticMap.get(context.fn)!.has(name)) {
			update(this.staticMap.get(context.fn)!);
		} else if (this.globalMap.has(name)) {
			update(this.globalMap);
		} else {
			throw new Error(`Variable ${name} does not exist`);
		}
	}

	public lengthOf(name: string, ...index: number[]): number {
		const context = this.context();
		function len(value: Value) {
			if (Array.isArray(value)) {
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				if (index[0] == null) {
					return value.length;
				}

				const depth1 = value[index[0]];
				if (Array.isArray(depth1)) {
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					if (index[1] == null) {
						return depth1.length;
					}

					const depth2 = depth1[index[1]];
					if (Array.isArray(depth2)) {
						return depth2.length;
					}

					return depth1.length;
				}

				return value.length;
			} else {
				return 1;
			}
		}

		if (context.dynamicMap.has(name)) {
			return len(context.dynamicMap.get(name)!);
		} else if (this.staticMap.get(context.fn)!.has(name)) {
			return len(this.staticMap.get(context.fn)!.get(name)!);
		} else if (this.globalMap.has(name)) {
			return len(this.globalMap.get(name)!);
		} else {
			throw new Error(`Cannot get length of variable ${name}`);
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
