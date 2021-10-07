import Statement from "./statement";
import Case from "./statement/command/case";
import DoWhile from "./statement/command/dowhile";
import For from "./statement/command/for";
import If from "./statement/command/if";
import Repeat from "./statement/command/repeat";
import While from "./statement/command/while";
export default class Thunk extends Statement {
    statement;
    labelMap;
    // NOTE: `statement` argument is mixed array of statments and labels
    constructor(statement) {
        super();
        this.statement = [];
        this.labelMap = new Map();
        for (let i = 0; i < statement.length; ++i) {
            const s = statement[i];
            if (typeof s === "string") {
                this.labelMap.set(s, this.statement.length);
            }
            else {
                this.statement.push(s);
            }
        }
        for (let i = 0; i < this.statement.length; ++i) {
            const s = this.statement[i];
            if (s instanceof Case) {
                for (const branch of s.branch) {
                    branch[1].labelMap.forEach((_, l) => this.labelMap.set(l, i));
                }
                s.def.labelMap.forEach((_, l) => this.labelMap.set(l, i));
            }
            else if (s instanceof For) {
                s.thunk.labelMap.forEach((_, l) => this.labelMap.set(l, i));
            }
            else if (s instanceof If) {
                for (const [, thunk] of s.ifThunk) {
                    thunk.labelMap.forEach((_, l) => this.labelMap.set(l, i));
                }
                s.elseThunk.labelMap.forEach((_, l) => this.labelMap.set(l, i));
            }
            else if (s instanceof Repeat) {
                s.thunk.labelMap.forEach((_, l) => this.labelMap.set(l, i));
            }
            else if (s instanceof While) {
                s.thunk.labelMap.forEach((_, l) => this.labelMap.set(l, i));
            }
            else if (s instanceof DoWhile) {
                s.thunk.labelMap.forEach((_, l) => this.labelMap.set(l, i));
            }
        }
    }
    *run(vm, label) {
        let start = 0;
        if (label != null) {
            start = this.labelMap.get(label) ?? 0;
        }
        for (let i = start; i < this.statement.length; ++i) {
            const statement = this.statement[i];
            const result = yield* statement.run(vm, label);
            switch (result?.type) {
                case "begin": return result;
                case "goto": {
                    if (this.labelMap.has(result.label)) {
                        return yield* this.run(vm, result.label);
                    }
                    else {
                        return result;
                    }
                }
                case "break": return result;
                case "continue": return result;
                case "throw": return result;
                case "return": return result;
                case "quit": return result;
                case undefined: continue;
            }
        }
        return null;
    }
}
