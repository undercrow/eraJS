import Statement from "../index";
export default class MouseSkip extends Statement {
    constructor(arg: string);
    run(): Generator<never, null, unknown>;
}
