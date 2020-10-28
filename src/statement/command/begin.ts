import type Statement from "../index";

export default class Begin implements Statement {
	public target: string;

	public constructor(target: string) {
		this.target = target;
	}

	public *run() {
		return <const>{
			type: "begin",
			keyword: this.target,
		};
	}
}
