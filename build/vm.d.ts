import Character from "./character";
import type Config from "./config";
import type Color from "./color";
import { Template, Data } from "./data";
import Fn from "./fn";
import type Property from "./property";
import Define from "./property/define";
import PRNG from "./random";
import type { default as Statement } from "./statement";
import type { Align } from "./statement/command/alignment";
import Value from "./value";
declare type Context = {
    fn: Fn;
    dynamicMap: Map<string, Value>;
    refMap: Map<string, string>;
};
export default class VM {
    random: PRNG;
    code: {
        header: Property[];
        fnList: Fn[];
        data: Data;
    };
    DEFAULT_STORAGE: Record<string, string>;
    external: {
        getFont: (name: string) => boolean;
        getGlobal: (key: string) => string | undefined;
        setGlobal: (key: string, value: string) => void;
    };
    eventMap: Map<string, Fn[]>;
    fnMap: Map<string, Fn>;
    macroMap: Map<string, Define>;
    templateMap: Map<number, Template>;
    globalMap: Map<string, Value>;
    staticMap: Map<string, Map<string, Value>>;
    characterList: Array<Character>;
    private contextStack;
    alignment: Align;
    draw: boolean;
    isLineEmpty: boolean;
    skipDisp: boolean;
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
    constructor(code: VM["code"], external?: VM["external"]);
    reset(): void;
    configure(config: Config): void;
    context(): Context;
    pushContext(fn: Fn): Context;
    popContext(): void;
    getValue<T extends Value>(name: string, scope?: string): T;
    start(): ReturnType<Statement["run"]>;
    print(text: string, cell?: "LEFT" | "RIGHT"): ReturnType<Statement["run"]>;
    newline(): ReturnType<Statement["run"]>;
    printSingle(text: string): ReturnType<Statement["run"]>;
}
export {};
