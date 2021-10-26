import Character from "./character";
import { Csv } from "./csv";
import type Config from "./config";
import type Color from "./color";
import { Template } from "./csv/character";
import Fn from "./fn";
import OutputQueue from "./output-queue";
import type Property from "./property";
import Define from "./property/define";
import PRNG from "./random";
import type { default as Statement, EraGenerator } from "./statement";
import type { Align } from "./statement/command/alignment";
import Value from "./value";
declare type Context = {
    fn: Fn;
    dynamicMap: Map<string, Value<any>>;
    refMap: Map<string, string>;
};
export default class VM {
    random: PRNG;
    code: {
        header: Property[];
        fnList: Fn[];
        csv: Csv;
    };
    external: {
        getSavedata: (key: string) => string | undefined;
        setSavedata: (key: string, value: string) => void;
        getFont: (name: string) => boolean;
        getTime: () => number;
    };
    eventMap: Map<string, Fn[]>;
    fnMap: Map<string, Fn>;
    macroMap: Map<string, Define>;
    templateMap: Map<number, Template>;
    globalMap: Map<string, Value<any>>;
    staticMap: Map<string, Map<string, Value<any>>>;
    characterList: Array<Character>;
    private contextStack;
    queue: OutputQueue;
    alignment: Align;
    font: {
        name: string;
        bold: boolean;
        italic: boolean;
        strike: boolean;
        underline: boolean;
    };
    color: {
        defaultFront: Color;
        defaultBack: Color;
        front: Color;
        back: Color;
        focus: Color;
    };
    printCPerLine: number;
    constructor(code: VM["code"]);
    reset(): void;
    configure(config: Config): void;
    context(): Context;
    pushContext(fn: Fn): Context;
    popContext(): void;
    getValue<T extends Value<any>>(name: string, scope?: string): T;
    start(external: VM["external"]): EraGenerator;
    run(statement: Statement, label?: string): EraGenerator;
}
export {};
