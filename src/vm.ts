import * as ast from "./ast";
import type {Program} from "./compiler";

function assert(condition: boolean, message: string): asserts condition {
	if (!condition) {
		throw new Error(message);
	}
}

type Color = {
	r: number;
	g: number;
	b: number;
};

type Value = string | number | null;
type Variable = Value | Value[];

export class State {
	public GLOBAL: Array<number | null>;
	public GLOBALS: Array<string | null>;
	public LINECOUNT: number;
	public globalMap: Map<string, Map<string, Variable>>;
	public staticMap: Map<string, Map<string, Variable>>;
	public style: {
		font: {
			name?: string;
			bold: boolean;
		};
		color: {
			front: Color;
		};
	};

	public constructor(program: Program) {
		this.GLOBAL = Array<null>(1000).fill(null);
		this.GLOBALS = Array<null>(100).fill(null);
		this.LINECOUNT = 0;
		this.globalMap = new Map<string, Map<string, Variable>>();
		this.staticMap = new Map<string, Map<string, Variable>>();
		for (const name of Object.keys(program.fn)) {
			this.staticMap.set(name, new Map());
		}
		this.style = {
			font: {
				name: undefined,
				bold: false,
			},
			color: {
				front: {
					r: 255,
					g: 255,
					b: 255,
				},
			},
		};
	}
}

class Context {
	public state: State;
	public dynamicMap: Map<string, Value>;
	public ARG: Array<number | null>;
	public ARGS: Array<string | null>;

	public constructor(state: State) {
		this.state = state;
		this.dynamicMap = new Map<string, Value>();
		this.ARG = Array<null>(1000).fill(null);
		this.ARGS = Array<null>(100).fill(null);
	}

	public getVar(name: string, index?: number): Value {
		switch (name) {
			case "ARG": {
				assert(index != null, "ARG is an array!");
				return this.ARG[index];
			}
			case "ARGS": {
				assert(index != null, "ARGS is an array!");
				return this.ARGS[index];
			}
			case "GLOBAL": {
				assert(index != null, "GLOBAL is an array!");
				return this.state.GLOBAL[index];
			}
			case "GLOBALS": {
				assert(index != null, "GLOBALS is an array!");
				return this.state.GLOBALS[index];
			}
			case "LINECOUNT": {
				return this.state.LINECOUNT;
			}
			default: {
				if (this.dynamicMap.has(name)) {
					return this.dynamicMap.get(name)!;
				} else {
					throw new Error(`Variable ${name} does not exist!`);
				}
			}
		}
	}

	public setVar(name: string, index: number | undefined, value: Value) {
		switch (name) {
			case "ARG": {
				assert(index != null, "ARG is an array!");
				assert(typeof value === "number", "Value for ARG should be a number");
				this.ARG[index] = value;
				break;
			}
			case "ARGS": {
				assert(index != null, "ARGS is an array!");
				assert(typeof value === "string", "Value for ARGS should be a string");
				this.ARGS[index] = value;
				break;
			}
			case "GLOBAL": {
				assert(index != null, "GLOBAL is an array!");
				assert(typeof value === "number", "Value for GLOBAL should be a number");
				this.state.GLOBAL[index] = value;
				break;
			}
			case "GLOBALS": {
				assert(index != null, "GLOBALS is an array!");
				assert(typeof value === "string", "Value for GLOBALS should be a string");
				this.state.GLOBALS[index] = value;
				break;
			}
			case "LINECOUNT": {
				assert(typeof value === "number", "Value for GLOBALS should be a string");
				this.state.LINECOUNT = value;
				break;
			}
			default: {
				if (this.dynamicMap.has(name)) {
					this.dynamicMap.set(name, value);
				} else {
					throw new Error(`Variable ${name} does not exist!`);
				}
			}
		}
	}
}

type Output =
	| {type: "string"; value: string}
	| {type: "line"}
	| {type: "clearline"; count: number}
	| {type: "wait"; value: "string" | "number"};

export function* exec(program: Program): Generator<Output, void, Value> {
	const state = new State(program);
	const context = new Context(state);

	yield* call(program, context, "SYSTEM_TITLE");
}

function* call(
	program: Program,
	context: Context,
	fnName: string,
): Generator<Output, Value, Value> {
	assert(program.fn[fnName] != null, `Function ${fnName} does not exist!`);
	for (const fn of program.fn[fnName]!) {
		for (const statement of fn.statement) {
			switch (statement.type) {
				case "label": break;
				case "command": switch (statement.command) {
					case "clearline": {
						const count = reduce(program, context, statement.count);
						assert(
							typeof count === "number",
							"Argument of CLEARLINE must be an integer!",
						);
						context.setVar(
							"LINECOUNT",
							undefined,
							context.getVar("LINECOUNT") as number - count,
						);
						yield {type: "clearline", count};
						break;
					}
					case "resetcolor": {
						context.state.style.color.front.r = 255;
						context.state.style.color.front.g = 255;
						context.state.style.color.front.b = 255;
						break;
					}
					default: throw new Error("Not Implemented!: " + statement.command);
				}
				// eslint-disable-next-line @typescript-eslint/indent
				break;
				case "conditional": {
					break;
				}
			}
		}
	}
	return null;
}

function reduce(
	program: Program,
	context: Context,
	expr: ast.IntExpr | ast.StringExpr,
): Value {
	switch (typeof expr) {
		case "number": return expr;
		case "string": return expr;
		default: switch (expr.type) {
			case "inlinecall": {
				const newContext = new Context(context.state);
				for (let i = 0; i < expr.arg.length; ++i) {
					// TODO
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					newContext.ARG[i] = reduce(program, context, expr.arg[i]) as any;
				}

				const generator = call(program, newContext, expr.name);
				while (true) {
					const next = generator.next();
					if (next.done === true) {
						return next.value!;
					}
				}
			}
			case "variable": {
				return context.getVar(expr.name);
			}
			case "binary": {
				const left = reduce(program, context, expr.left);
				const right = reduce(program, context, expr.right);

				if (typeof left === "number" && typeof right === "number") {
					switch (expr.op) {
						case "*": return left * right;
						default: {
							throw new Error(
								`Binary operation ${expr.op} is not implemented yet!`,
							);
						}
					}
				} else if (typeof left === "string" && typeof right === "string") {
					throw new Error("Reducing string expression is not implemented yet!");
				} else {
					throw new Error(
						`Wrong argument type for ${expr.op}: ${typeof left}, ${typeof right}`,
					);
				}
			}
		}
	}
}
