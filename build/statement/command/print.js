import * as U from "../../parser/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R0(U.charSeq()).map((str) => str ?? "");
export default class Print extends Statement {
    static *runPostfix(vm, value) {
        // let out: OutType = null;
        let action = null;
        switch (value) {
            case "":
                action = null;
                break;
            case "L":
                action = "newline";
                break;
            case "W":
                action = "wait";
                break;
            case "K":
                action = null;
                break;
            case "KL":
                action = "newline";
                break;
            case "KW":
                action = "wait";
                break;
            case "D":
                action = null;
                break;
            case "DL":
                action = "newline";
                break;
            case "DW":
                action = "wait";
                break;
            default: throw new Error(`${value} is not a valid print postfix`);
        }
        // TODO: Apply outType
        switch (action) {
            case "newline": {
                yield* vm.newline();
                break;
            }
            case "wait": {
                yield* vm.newline();
                yield { type: "wait", force: false };
                break;
            }
            case null: {
                // Do nothing
                break;
            }
        }
        return null;
    }
    postfix;
    value;
    constructor(instruction, raw) {
        super(raw);
        this.postfix = instruction.replace(/^PRINT/, "");
        this.value = new Lazy(raw, PARSER);
    }
    *run(vm) {
        if (vm.skipDisp) {
            return null;
        }
        yield* vm.print(this.value.get());
        yield* Print.runPostfix(vm, this.postfix);
        return null;
    }
}
