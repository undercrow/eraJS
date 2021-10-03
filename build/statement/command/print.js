import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.arg1R0(U.charSeq()).map((str) => str ?? "");
export default class Print extends Statement {
    static *print(vm, text) {
        if (text.length === 0) {
            return null;
        }
        const lines = text.split("\n");
        for (let i = 0; i < lines.length - 1; ++i) {
            yield { type: "string", text: lines[i] };
            yield { type: "string", text: "\n" };
        }
        yield { type: "string", text: lines[lines.length - 1] };
        const lineCount = vm.getValue("LINECOUNT").get(vm, []);
        vm.getValue("LINECOUNT").set(vm, lineCount + (text.match(/\n/g) ?? []).length, []);
        return null;
    }
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
                yield* Print.print(vm, "\n");
                break;
            }
            case "wait": {
                yield* Print.print(vm, "\n");
                yield { type: "wait" };
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
        super();
        this.postfix = instruction.replace(/^PRINT/, "");
        this.value = new Lazy(raw, PARSER);
    }
    *run(vm) {
        if (vm.skipDisp) {
            return null;
        }
        yield* Print.print(vm, this.value.get());
        yield* Print.runPostfix(vm, this.postfix);
        return null;
    }
}
