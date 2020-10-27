import * as ast from "./ast";
import type {Program, State} from "./compiler";

function assert(condition: boolean, message: string): asserts condition {
	if (!condition) {
		throw new Error(message);
	}
}

type Value = string | number | null;

class Context {
	public state: State;
	public fn: string;
	public dynamicMap: Map<string, Array<Value>>;
	public ARG: Array<number | null>;
	public ARGS: Array<string | null>;

	public constructor(state: State, fn: string) {
		this.state = state;
		this.fn = fn;
		this.dynamicMap = new Map();
		this.ARG = Array<null>(1000).fill(null);
		this.ARGS = Array<null>(100).fill(null);
	}

	public getVar(name: string, index?: number): Value {
		switch (name) {
			case "RESULT": {
				return this.state.RESULT[index ?? 0];
			}
			case "RESULTS": {
				return this.state.RESULTS[index ?? 0];
			}
			case "ARG": {
				return this.ARG[index ?? 0];
			}
			case "ARGS": {
				return this.ARGS[index ?? 0];
			}
			case "GLOBAL": {
				return this.state.GLOBAL[index ?? 0];
			}
			case "GLOBALS": {
				return this.state.GLOBALS[index ?? 0];
			}
			case "LOCAL": {
				const localArray =
					this.state.staticMap.get(this.fn)!.get("LOCAL")! as Array<number | null>;
				return localArray[index ?? 0];
			}
			case "LOCALS": {
				const localArray =
					this.state.staticMap.get(this.fn)!.get("LOCALS")! as Array<string | null>;
				return localArray[index ?? 0];
			}
			case "GAMEBASE_AUTHOR": {
				return this.state.GAMEBASE.AUTHOR;
			}
			case "GAMEBASE_INFO": {
				return this.state.GAMEBASE.INFO;
			}
			case "GAMEBASE_TITLE": {
				return this.state.GAMEBASE.TITLE;
			}
			case "GAMEBASE_VERSION": {
				return this.state.GAMEBASE.VERSION;
			}
			case "LINECOUNT": {
				return this.state.LINECOUNT;
			}
			default: {
				if (this.dynamicMap.has(name)) {
					return this.dynamicMap.get(name)![index ?? 0];
				} else {
					throw new Error(`Variable ${name} does not exist!`);
				}
			}
		}
	}

	public setVar(name: string, index: number | undefined, value: Value) {
		switch (name) {
			case "RESULT": {
				assert(typeof value === "number", "Value for RESULT should be a number");
				this.state.RESULT[index ?? 0] = value;
				break;
			}
			case "RESULTS": {
				assert(typeof value === "string", "Value for RESULTS should be a string");
				this.state.RESULTS[index ?? 0] = value;
				break;
			}
			case "ARG": {
				assert(typeof value === "number", "Value for ARG should be a number");
				this.ARG[index ?? 0] = value;
				break;
			}
			case "ARGS": {
				assert(typeof value === "string", "Value for ARGS should be a string");
				this.ARGS[index ?? 0] = value;
				break;
			}
			case "GLOBAL": {
				assert(typeof value === "number", "Value for GLOBAL should be a number");
				this.state.GLOBAL[index ?? 0] = value;
				break;
			}
			case "GLOBALS": {
				assert(typeof value === "string", "Value for GLOBALS should be a string");
				this.state.GLOBALS[index ?? 0] = value;
				break;
			}
			case "LOCAL": {
				assert(typeof value === "number", "Value for LOCAL should be a number");
				const localArray =
					this.state.staticMap.get(this.fn)!.get("LOCAL")! as Array<number | null>;
				localArray[index ?? 0] = value;
				break;
			}
			case "LOCALS": {
				assert(typeof value === "string", "Value for LOCALS should be a string");
				const localArray =
					this.state.staticMap.get(this.fn)!.get("LOCALS")! as Array<string | null>;
				localArray[index ?? 0] = value;
				break;
			}
			case "LINECOUNT": {
				assert(typeof value === "number", "Value for GLOBALS should be a string");
				this.state.LINECOUNT = value;
				break;
			}
			case "GAMEBASE_AUTHOR":
			case "GAMEBASE_INFO":
			case "GAMEBASE_TITLE":
			case "GAMEBASE_VERSION":
			default: {
				if (this.dynamicMap.has(name)) {
					this.dynamicMap.get(name)![index ?? 0] = value;
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
	| {type: "loadglobal"}
	| {type: "wait"}
	| {type: "input"};

export function* exec(program: Program, state: State): Generator<Output, void, string> {
	const context = new Context(state, "SYSTEM_TITLE");

	yield* call(program, context, "SYSTEM_TITLE");
}

function* call(
	program: Program,
	context: Context,
	fnName: string,
): Generator<Output, Value, string> {
	assert(program.fn[fnName] != null, `Function ${fnName} does not exist!`);
	for (const fn of program.fn[fnName]!) {
		for (const statement of fn.statement) {
			const result = yield* runStatement(program, context, statement);
			if (result !== undefined) {
				return result;
			}
		}
	}
	return null;
}

function* runStatement(
	program: Program,
	context: Context,
	statement: ast.Statement,
): Generator<Output, Value | undefined, string> {
	switch (statement.type) {
		case "label": break;
		case "assign": {
			context.setVar(
				statement.dest.name,
				undefined,
				reduce(program, context, statement.expr),
			);
			break;
		}
		case "command": {
			// Special case for return command
			if (statement.command === "return") {
				return reduce(program, context, statement.expr);
			}

			yield* runCommand(program, context, statement);
			break;
		}
		case "conditional": {
			throw new Error("Conditional expression not implmeneted!");
		}
	}
	return undefined;
}

function* runCommand(
	program: Program,
	context: Context,
	command: ast.Command,
): Generator<Output, void, string> {
	switch (command.command) {
		case "print": {
			const value = reduce(program, context, command.value) as string;
			yield {type: "string", value};

			// TODO: outType

			// Actions
			if (command.action === "newline") {
				yield {type: "string", value: "\n"};
				context.setVar(
					"LINECOUNT",
					undefined,
					context.getVar("LINECOUNT") as number + 1,
				);
			} else if (command.action === "wait") {
				yield {type: "wait"};
			}

			break;
		}
		case "drawline": {
			yield {type: "line"};
			break;
		}
		case "clearline": {
			const count = reduce(program, context, command.count);
			assert(typeof count === "number", "Argument of CLEARLINE must be an integer!");
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
		case "fontbold": {
			context.state.style.font.bold = !context.state.style.font.bold;
			break;
		}
		case "fontregular": {
			context.state.style.font.bold = false;
			break;
		}
		case "setfont": {
			const font = reduce(program, context, command.font);
			assert(typeof font === "string", "Argument of SETFONT must be a string!");
			context.state.style.font.name = font;
			break;
		}
		case "alignment": {
			context.state.style.alignment = command.align;
			break;
		}
		case "strlen": {
			const value = reduce(program, context, command.expr);
			assert(typeof value === "string", "Argument of STRLEN must be a string!");
			context.setVar("RESULT", 0, value.length);
			break;
		}
		case "substring": {
			const original = reduce(program, context, command.expr);
			assert(typeof original === "string", "1st argument of SUBSTRING must be a string!");
			const start = reduce(program, context, command.start);
			assert(typeof start === "number", "2nd argument of SUBSTRING must be a number!");
			const end = reduce(program, context, command.end);
			assert(typeof end === "number", "3rd argument of SUBSTRING must be a number!");
			if (end < 0) {
				context.setVar("RESULTS", 0, original.slice(start));
			} else {
				context.setVar("RESULTS", 0, original.slice(start, end));
			}

			break;
		}
		case "loadglobal": {
			yield {type: "loadglobal"};
			break;
		}
		case "input": {
			// TODO: default value
			let value: number = NaN;
			do {
				const input = parseInt(yield {type: "input"});
				if (!isNaN(input)) {
					value = input;
				}
			} while (isNaN(value));
			context.setVar("RESULT", 0, value);

			break;
		}
		default: throw new Error("Not Implemented!: " + command.command);
	}
}

function reduce(
	program: Program,
	context: Context,
	expr: ast.IntExpr | ast.StringExpr | ast.Form,
): Value {
	switch (typeof expr) {
		case "number": return expr;
		case "string": return expr;
		default: switch (expr.type) {
			case "inlinecall": {
				const newContext = new Context(context.state, expr.name);
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
						case "/": return Math.floor(left / right);
						case "-": return left - right;
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
			case "form": {
				let result = "";
				for (const child of expr.expr) {
					const value = reduce(program, context, child);
					switch (typeof value) {
						case "number": {
							result += value.toString();
							break;
						}
						case "string": {
							result += value;
							break;
						}
						default: {
							// Do nothing
						}
					}
				}
				return result;
			}
		}
	}
}
