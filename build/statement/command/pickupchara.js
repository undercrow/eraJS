import * as E from "../../erb/expr";
import * as U from "../../erb/util";
import Lazy from "../../lazy";
import Statement from "../index";
const PARSER = U.argNR0(E.expr);
export default class PickupChara extends Statement {
    expr;
    constructor(raw) {
        super();
        this.expr = new Lazy(raw, PARSER);
    }
    *run() {
        throw new Error("PICKUPCHARA is not implemented yet!");
        return null;
    }
}
