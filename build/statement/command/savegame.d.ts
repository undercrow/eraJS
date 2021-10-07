import Statement from "../index";
export default class SaveGame extends Statement {
    constructor(arg: string);
    run(): Generator<never, null, unknown>;
}
