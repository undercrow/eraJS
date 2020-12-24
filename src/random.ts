// Mulberry32 PRNG
// https://gist.github.com/tommyettinger/46a874533244883189143505d203312c

export default class PRNG {
	public state: number;

	public constructor() {
		this.state = Math.floor(Math.random() * (2 ** 32));
	}

	/* eslint-disable no-bitwise */
	public next(): number {
		this.state += 0x6D2B79F5;
		let z = this.state;
		z = Math.imul(z ^ z >>> 15, z | 1);
		z ^= z + Math.imul(z ^ z >>> 7, z | 61);
		return (z ^ z >>> 14) >>> 0;
	}
	/* eslint-enable no-bitwise */
}
