import Statement from "../index";
export default class MouseY extends Statement {
    constructor(arg: string);
    run(): Generator<never, null, unknown>;
}
