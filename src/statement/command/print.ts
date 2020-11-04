import type VM from "../../vm";
import type Expr from "../expr";
import Statement from "../index";

type OutType = "K" | "D";
type Action = "newline" | "wait";

// TODO: Plain
// TODO: Buttonize some texts
export default class Print extends Statement {
	public value: Expr;
	public outType?: OutType;
	public action?: Action;

	public constructor(value: Expr, outType?: OutType, action?: Action) {
		super();
		this.value = value;
		this.outType = outType;
		this.action = action;
	}

	public *run(vm: VM) {
		const value = this.value.reduce(vm);
		yield <const>{
			type: "string",
			text: typeof value === "string" ? value : value.toString(),
		};

		// TODO: outType
		// eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
		switch (this.action) {
			case "newline": {
				yield <const>{type: "string", text: "\n"};
				const lineCount = vm.getValue("LINECOUNT") as number;
				vm.setValue(lineCount + 1, "LINECOUNT");
				break;
			}
			case "wait": {
				yield <const>{type: "wait"};
				break;
			}
		}

		return null;
	}
}
