import { parse } from "acorn";
import type { IRExpr, IRStatement } from "./types";
import { StatementToIR } from "./statement";
import { ExpressionToIR } from "./expr";

interface IRFunc {
    args: string[];
    code: IRStatement[];
    ret?: IRExpr;
}

export function codeToIR(code: string): {
    main: IRStatement[];
    funcs: Map<string, IRFunc>;
 } {
    const ast = parse(code, { ecmaVersion: "latest" });
    const main: IRStatement[] = [];
    const funcs = new Map<string, IRFunc>();

    for (const statement of ast.body) {
        if (statement.type === "FunctionDeclaration") {
            if (statement.async || statement.generator) {
                throw new Error("unsupported syntax");
            }
            const args = statement.params.map(e => {
                if (e.type === "Identifier") {
                    return e.name;
                } else {
                    throw new Error("unsupported syntax");
                }
            });
            const ret_st = statement.body.body.at(-1);
            
            if (ret_st?.type === "ReturnStatement" && ret_st.argument) {
                funcs.set(statement.id.name, {
                    args,
                    code: statement.body.body.slice(0, statement.body.body.length - 1).flatMap(e=>[...StatementToIR(e)]),
                    ret: ExpressionToIR(ret_st.argument),
                });
            } else {
                funcs.set(statement.id.name, {
                    args,
                    code: statement.body.body.flatMap(e=>[...StatementToIR(e)]),
                });
            }
        } else {
            main.push(...StatementToIR(statement));
        }
    }

    return { main, funcs };
}
