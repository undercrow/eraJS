import Statement from "../index";
export default class StrData extends Statement {
    constructor(arg: string);
    run(): Generator<never, null, unknown>;
}
