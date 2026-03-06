import type { Node } from "acorn";

export const at = (node: Node) => `at ${node.loc!.source}:${node.loc!.start.line}:${node.loc!.start.column}`;
