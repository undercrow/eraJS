import P from "parsimmon";
import { assertNumber } from "../../assert";
import * as color from "../../color";
import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = P.alt(U.arg3R3(E.expr, E.expr, E.expr), U.arg1R1(E.expr));
export default class SetColor extends Statement {
    value;
    constructor(raw) {
        super();
        this.value = new Lazy(raw, PARSER);
    }
    *run(vm) {
        const parsed = this.value.get();
        let value;
        if (Array.isArray(parsed)) {
            const r = parsed[0].reduce(vm);
            const g = parsed[1].reduce(vm);
            const b = parsed[2].reduce(vm);
            assertNumber(r, "1st argument of SETCOLOR must be an integer");
            assertNumber(g, "2nd argument of SETCOLOR must be an integer");
            assertNumber(b, "3rd argument of SETCOLOR must be an integer");
            value = color.toHex({ r, g, b });
        }
        else {
            const rgb = parsed.reduce(vm);
            assertNumber(rgb, "Argument of SETCOLOR must be an integer");
            value = rgb;
        }
        vm.color.front = color.hex(value);
        return null;
    }
}
