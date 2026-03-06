import type { Node } from "acorn";

export const at = (node: Node) => `at ${node.loc!.source}:${node.loc!.start.line}:${node.loc!.start.column}`;

export class ParseError extends Error {
    constructor(message: string, node: Node) {
        super(`${message} ${at(node)}`);
    }
}
