import Statement from "../index";

export default class Quit extends Statement {
	public *run() {
		return <const>{
			type: "quit",
		};
	}
}
