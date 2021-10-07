import Statement from "../index";
export default class WaitAnyKey extends Statement {
    constructor(arg: string);
    run(): Generator<never, null, unknown>;
}
