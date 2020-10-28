export function assert(condition: boolean, message: string): asserts condition {
	if (!condition) {
		throw new Error(message);
	}
}

export function assertNumber(value: any, message: string): asserts value is number {
	assert(typeof value === "number", message);
}

export function assertString(value: any, message: string): asserts value is string {
	assert(typeof value === "string", message);
}
