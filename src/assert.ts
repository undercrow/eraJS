export function cond(value: boolean, message: string): asserts value {
	if (!value) {
		throw new Error(message);
	}
}

export function nonNull<T>(value: T, message: string): asserts value is NonNullable<T> {
	cond(value != null, message);
}

export function number(value: any, message: string): asserts value is number {
	cond(typeof value === "number" && !isNaN(value), message);
}

export function string(value: any, message: string): asserts value is string {
	cond(typeof value === "string", message);
}

export function array(value: any, message: string): asserts value is any[] {
	cond(Array.isArray(value), message);
}

export function numArray(value: any, message: string): asserts value is number[] {
	array(value, message);
	for (let i = 0; i < value.length; ++i) {
		number(value[i], message);
	}
}

export function strArray(value: any, message: string): asserts value is string[] {
	cond(Array.isArray(value), message);
	for (let i = 0; i < value.length; ++i) {
		string(value[i], message);
	}
}

export function numArray2D(value: any, message: string): asserts value is number[][] {
	array(value, message);
	for (let i = 0; i < value.length; ++i) {
		numArray(value[i], message);
	}
}
