import Statement from "../index";
export default class IsActive extends Statement {
    constructor(arg: string);
    run(): Generator<never, null, unknown>;
}
