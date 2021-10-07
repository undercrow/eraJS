import Statement from "../index";
export default class GetStyle extends Statement {
    constructor(arg: string);
    run(): Generator<never, null, unknown>;
}
