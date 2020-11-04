type Color = {
	r: number;
	g: number;
	b: number;
};

export function copy(color: Color): Color {
	return {...color};
}

export function rgb(r: number, g: number, b: number): Color {
	return {r, g, b};
}

export function hex(value: number): Color {
	/* eslint-disable no-bitwise */
	const r = (value && 0xFF0000) >> 16;
	const g = (value && 0x00FF00) >> 8;
	const b = (value && 0x0000FF) >> 0;
	/* eslint-enable no-bitwise */
	return {r, g, b};
}

export function toHex(color: Color): number {
	// eslint-disable-next-line no-bitwise
	return (color.r << 16) + (color.g << 8) + (color.b << 0);
}

export default Color;
