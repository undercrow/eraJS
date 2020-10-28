import Statement from "../index";

export default class Break extends Statement {
	public *run() {
		return <const>{
			type: "break",
		};
	}
}
