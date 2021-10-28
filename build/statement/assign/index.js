import P from "parsimmon";
import * as E from "../../error";
import * as C from "../../parser/const";
import * as X from "../../parser/expr";
import * as U from "../../parser/util";
import Statement from "../index";
import AssignForm from "./assign-form";
import AssignInt from "./assign-int";
import AssignOpInt from "./assign-op-int";
import AssignOpStr from "./assign-op-str";
import AssignPrefix from "./assign-prefix";
import AssignPostfix from "./assign-postfix";
import AssignStr from "./assign-str";
const PARSER_PREFIX = P.seq(U.alt("++", "--").trim(C.WS0), X.variable, P.all);
const PARSER_POSTFIX = P.seq(X.variable, U.alt("++", "--").trim(C.WS0), P.all);
const PARSER_VAR = P.seq(X.variable, P.alt(U.alt("="), U.alt("'="), U.alt("*=", "/=", "%=", "+=", "-=", "&=", "|=", "^=")).trim(C.WS0), P.all);
export default class Assign extends Statement {
    inner;
    constructor(raw) {
        super(raw);
    }
    compile(vm) {
        try {
            const [op, dest, rest] = U.tryParse(PARSER_PREFIX, this.raw);
            const restSlice = this.raw.slice(this.raw.length() - rest.length);
            const destType = dest.getCell(vm).type;
            if (op === "++" && destType === "number") {
                this.inner = new AssignPrefix(dest, "++", restSlice);
            }
            else if (op === "--" && destType === "number") {
                this.inner = new AssignPrefix(dest, "--", restSlice);
            }
            return;
        }
        catch { /* Do nothing */ }
        try {
            const [dest, op, rest] = U.tryParse(PARSER_POSTFIX, this.raw);
            const restSlice = this.raw.slice(this.raw.length() - rest.length);
            const destType = dest.getCell(vm).type;
            if (op === "++" && destType === "number") {
                this.inner = new AssignPostfix(dest, "++", restSlice);
            }
            else if (op === "--" && destType === "number") {
                this.inner = new AssignPostfix(dest, "--", restSlice);
            }
            return;
        }
        catch { /* Do nothing */ }
        try {
            const [dest, op, rest] = U.tryParse(PARSER_VAR, this.raw);
            const restSlice = this.raw.slice(this.raw.length() - rest.length);
            const destType = dest.getCell(vm).type;
            if (op === "=" && destType === "number") {
                this.inner = new AssignInt(dest, restSlice);
            }
            else if (op === "=" && destType === "string") {
                this.inner = new AssignForm(dest, restSlice);
            }
            else if (op === "'=") {
                this.inner = new AssignStr(dest, restSlice);
            }
            else if (op === "+=" && destType === "string") {
                this.inner = new AssignOpStr(dest, "+=", restSlice);
            }
            else if (["*=", "/=", "%=", "+=", "-=", "&=", "|=", "^="].includes(op) &&
                destType === "number") {
                this.inner = new AssignOpInt(dest, op, restSlice);
            }
            return;
        }
        catch { /* Do nothing */ }
        throw E.parser("Invalid assignment expression");
    }
    async *run(vm) {
        if (this.inner == null) {
            this.compile(vm);
        }
        return yield* vm.run(this.inner);
    }
}
