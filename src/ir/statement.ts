import type { ModuleDeclaration, Statement } from "acorn";
import type { IRStatement } from "./types";
import { ExpressionToIR } from "./expr";
import { at, ParseError } from "./error";

const unwrap_block = (statement: Statement): {
    type: "block",
    body: IRStatement[],
} => {
    const ir = [...StatementToIR(statement)];
    if (ir.length === 1 && ir[0]!.type === "block") {
        return ir[0]!;
    } else {
        throw new ParseError(`Unsupported Non-BlockStatement`, statement);
    }
}

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
                        throw new ParseError(`Unsupported Assignment: ${statement.expression.operator}`, statement.expression);
                }
                yield { type: "assign", id, value };
            } else if (statement.expression.type === "CallExpression" && statement.expression.callee.type === "Identifier") {
                yield {
                    type: "call",
                    name: statement.expression.callee.name,
                    args: statement.expression.arguments.map(ExpressionToIR),
                };
            } else if (statement.expression.type === "UpdateExpression" && statement.expression.argument.type === "Identifier" ) {
                const id = statement.expression.argument.name;
                switch (statement.expression.operator) {
                    case "++":
                        yield {
                            type: "assign",
                            id,
                            value: {
                                type: "add",
                                left: { type: "id", id },
                                right: { type: "const", value: 1 },
                            },
                        };
                        break;
                    case "--":
                        yield {
                            type: "assign",
                            id,
                            value: {
                                type: "sub",
                                left: { type: "id", id },
                                right: { type: "const", value: 1 },
                            },
                        };
                        break;
                }
            } else {
                console.warn(`Warning: ExpressionStatement that is not a specific type, That will be ignored.
    ${at(statement)}`);
            }
            break;
        case "VariableDeclaration":
            for (const decl of statement.declarations) {
                if (decl.id.type === "Identifier") {
                    const id = decl.id.name;
                    if (!decl.init) {
                        console.warn(`Warning: Undefined variable detected: ${id}.
The initial value of that variable may be an unknown value.
Be careful.
    ${at(decl)}`);
                    }
                    yield {
                        type: "vardef",
                        id,
                        value: decl.init ? ExpressionToIR(decl.init) : undefined,
                    };
                } else {
                    throw new ParseError(`Unsupported Variable Declaration: ${decl.id.type}`, decl.id);
                }
            }
            break;
        case "WhileStatement":
            yield {
                type: "while",
                condition: ExpressionToIR(statement.test),
                body: unwrap_block(statement.body),
            };
            break;
        case "IfStatement":
            yield {
                type: "if",
                condition: ExpressionToIR(statement.test),
                body: unwrap_block(statement.consequent),
                else: statement.alternate ? unwrap_block(statement.alternate) : undefined,
            };
            break;
        case "ForStatement":
            const block: IRStatement[] = [];
            if (statement.init?.type === "VariableDeclaration") {
                block.push(...StatementToIR(statement.init));
            } else if (statement.init) {
                block.push(...StatementToIR({ type: "ExpressionStatement", expression: statement.init, start: 0, end: 0 }));
            }

            const body = unwrap_block(statement.body);
            if (statement.update) {
                body.body.push(...StatementToIR({ type: "ExpressionStatement", expression: statement.update, start: 0, end: 0 }));
            }

            block.push({
                type: "while",
                condition: statement.test ? ExpressionToIR(statement.test) : { type: "const", value: 1 },
                body,
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
            throw new ParseError(`Unsupported Statement: ${statement.type}`, statement);
    }
}
