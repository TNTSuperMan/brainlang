import type { ModuleDeclaration, Statement } from "acorn";
import type { IRStatement } from "./types";
import { ExpressionToIR } from "./expr";

const wrap_stir = (statement: Statement): IRStatement => ({
    type: "block",
    body: [...StatementToIR(statement)],
})

export function* StatementToIR(statement: Statement | ModuleDeclaration): Generator<IRStatement> {
    switch (statement.type) {
        case "ExpressionStatement":
            if (statement.expression.type === "AssignmentExpression" && statement.expression.left.type === "Identifier") {
                const id = statement.expression.left.name;
                let value = ExpressionToIR(statement.expression.right);
                switch (statement.expression.operator) {
                    case "=": break;
                    case "+=":
                        value = { type: "add", left: { type: "id", id }, right: value };
                        break;
                    case "-=":
                        value = { type: "sub", left: { type: "id", id }, right: value };
                        break;
                    case "*=":
                        value = { type: "mul", left: { type: "id", id }, right: value };
                        break;
                    case "/=":
                        value = { type: "div", left: { type: "id", id }, right: value };
                        break;
                    default:
                        throw new Error("No supported syntax detected");
                }
                yield { type: "assign", id, value };
            } else if (statement.expression.type === "CallExpression") {
                throw new Error("unimplemented");
            } else {
                throw new Error("No supported syntax detected");
            }
            break;
        case "VariableDeclaration":
            for (const decl of statement.declarations) {
                if (decl.id.type === "Identifier") {
                    const id = decl.id.name;
                    if (!decl.init) {
                        console.warn(`Undefined variable detected: ${id}.
The initial value of that variable may be an unknown value.
Be careful.`);
                    }
                    yield {
                        type: "vardef",
                        id,
                        value: decl.init ? ExpressionToIR(decl.init) : undefined,
                    };
                } else {
                    throw new Error("No supported syntax detected");
                }
            }
            break;
        case "WhileStatement":
            yield {
                type: "while",
                condition: ExpressionToIR(statement.test),
                body: wrap_stir(statement.body),
            };
            break;
        case "IfStatement":
            yield {
                type: "if",
                condition: ExpressionToIR(statement.test),
                body: wrap_stir(statement.consequent),
                else: statement.alternate ? wrap_stir(statement.alternate) : undefined,
            };
            break;
        case "ForStatement":
            const block: IRStatement[] = [];
            if (statement.init?.type === "VariableDeclaration") {
                block.push(...StatementToIR(statement.init));
            } else if (statement.init) {
                block.push(...StatementToIR({ type: "ExpressionStatement", expression: statement.init, start: 0, end: 0 }));
            }

            block.push({
                type: "while",
                condition: statement.test ? ExpressionToIR(statement.test) : { type: "const", value: 1 },
                body: {
                    type: "block",
                    body: [
                        ...StatementToIR(statement.body),
                        ...(statement.update
                            ? StatementToIR({ type: "ExpressionStatement", expression: statement.update, start: 0, end: 0 })
                            : []
                        ),
                    ],
                },
            });

            yield {
                type: "block",
                body: block,
            };
            break;
        case "BlockStatement":
            yield {
                type: "block",
                body: statement.body.flatMap(s=>StatementToIR(s).toArray()),
            };
            break;
        case "EmptyStatement": break;
        default:
            throw new Error("No supported syntax detected");
    }
}
