import Statement from "../index";
export default class StopCallTrain extends Statement {
    constructor(arg: string);
    run(): Generator<never, null, unknown>;
}
