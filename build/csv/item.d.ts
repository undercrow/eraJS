declare type Item = {
    name: string;
    price: number;
};
export default function parse(fileName: string, rows: string[][]): Map<number, Item>;
export {};
