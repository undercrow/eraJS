import Slice from "./slice";

export default class EraJSError extends Error {
	public line: Slice;
	public trace: string[];

	public constructor(message: string, line: Slice, trace: string[]) {
		super(message);
		this.line = line;
		this.trace = trace;
	}
}

export function parser(message: string) {
	return new Error(`Parser error found: ${message}`);
}

export function notFound(type: string, name: string) {
	return new Error(`${type} ${name} does not exist`);
}

export function invalidIndex(type: string, name: string, index: number[]) {
	return new Error(`${type} variable ${name} cannot be indexed by [${index.join(",")}]`);
}

export function notImpl(target: string) {
	return new Error(`${target} is not implemented yet`);
}

export function misc(message: string) {
	return new Error(`Runtime error found: ${message}`);
}

export function internal(message: string) {
	return new Error(`Unexpected internal error found: ${message}`);
}
