import Slice from "../../slice";
import Statement, { EraGenerator } from "../index";
export default class SaveGame extends Statement {
    constructor(raw: Slice);
    run(): EraGenerator;
}
