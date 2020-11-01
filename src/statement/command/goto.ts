import Statement from "../index";

export default class Goto extends Statement {
	public target: string;

	public constructor(target: string) {
		super();
		this.target = target.toUpperCase();
	}

	public *run() {
		return <const>{
			type: "goto",
			label: this.target,
		};
	}
}
