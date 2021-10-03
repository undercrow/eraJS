import Statement from "../index";
export default class AddVoidChara extends Statement {
    constructor(arg: string);
    run(): Generator<never, null, unknown>;
}
