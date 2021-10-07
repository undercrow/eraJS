import Statement from "../index";
export default class LineIsEmpty extends Statement {
    constructor(arg: string);
    run(): Generator<never, null, unknown>;
}
