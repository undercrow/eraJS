import Statement from "../index";
export default class ForceWait extends Statement {
    constructor(arg: string);
    run(): Generator<never, null, unknown>;
}
