import Fn from "../../fn";
import Statement from "../index";

export default class Restart extends Statement {
	public *run() {
		return <const>{
			type: "goto",
			label: Fn.START_OF_FN,
		};
	}
}
