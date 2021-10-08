export function cond(value: boolean, message: string): asserts value {
	if (!value) {
		throw new Error(message);
	}
}

export function number(value: any, message: string): asserts value is number {
	cond(
		typeof value === "number" && !isNaN(value),
		message,
	);
}

export function string(value: any, message: string): asserts value is string {
	cond(typeof value === "string", message);
}
