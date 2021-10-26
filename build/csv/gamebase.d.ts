declare type GameBase = {
    author?: string;
    info?: string;
    year?: string;
    title?: string;
    code?: number;
    version?: number;
};
export default function parse(fileName: string, rows: string[][]): GameBase;
export {};
