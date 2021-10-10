import Statement from "../index";
export default class IsSkip extends Statement {
    constructor(arg: string);
    run(): Generator<never, null, unknown>;
}
