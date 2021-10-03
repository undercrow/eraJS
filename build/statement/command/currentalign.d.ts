import Statement from "../index";
export default class CurrentAlign extends Statement {
    constructor(arg: string);
    run(): Generator<never, null, unknown>;
}
