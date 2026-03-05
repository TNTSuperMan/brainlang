import { parse } from "acorn";
import type { IRStatement } from "./types";
import { StatementToIR } from "./statement";

export function codeToIR(code: string): IRStatement[] {
    const ast = parse(code, { ecmaVersion: "latest" });
    return ast.body.flatMap(s=>StatementToIR(s).toArray());
}
