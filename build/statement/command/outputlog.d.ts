import Statement from "../index";
export default class OutputLog extends Statement {
    constructor(arg: string);
    run(): Generator<never, null, unknown>;
}
