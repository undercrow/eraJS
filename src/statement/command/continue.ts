import Statement from "../index";

export default class Continue extends Statement {
	public *run() {
		return <const>{
			type: "continue",
		};
	}
}
