import Statement from "../index";
export default class ClearTextBox extends Statement {
    constructor(arg: string);
    run(): Generator<never, null, unknown>;
}
