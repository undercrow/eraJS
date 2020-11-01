import Statement from "../index";

export default class Begin extends Statement {
	public target: string;

	public constructor(target: string) {
		super();
		this.target = target.toUpperCase();
	}

	public *run() {
		return <const>{
			type: "begin",
			keyword: this.target,
		};
	}
}
