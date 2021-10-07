import Statement from "../index";
export default class ResetGlobal extends Statement {
    constructor(arg: string);
    run(): Generator<never, null, unknown>;
}
