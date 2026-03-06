import type { Expression, PrivateIdentifier, SpreadElement } from "acorn";
import type { IRExpr } from "./types";
import { ParseError } from "./error";

export function ExpressionToIR(expr: Expression | PrivateIdentifier | SpreadElement): IRExpr {
    switch (expr.type) {
        case "Identifier":
            return { type: "id", id: expr.name };
        case "Literal":
            if (typeof expr.value === "number") {
                return { type: "const", value: expr.value };
            } else {
                throw new ParseError(`Unsupported Literal: ${expr.value}`, expr);
            }
        case "BinaryExpression":
            switch (expr.operator) {
                case "+":
                    return { type: "add", left: ExpressionToIR(expr.left), right: ExpressionToIR(expr.right) };
                case "-":
                    return { type: "sub", left: ExpressionToIR(expr.left), right: ExpressionToIR(expr.right) };
                case "*":
                    return { type: "mul", left: ExpressionToIR(expr.left), right: ExpressionToIR(expr.right) };
                case "/":
                    return { type: "div", left: ExpressionToIR(expr.left), right: ExpressionToIR(expr.right) };
                default:
                    throw new ParseError(`Unsupported Binary Operation: ${expr.operator}`, expr);
            }
        case "CallExpression":
            if (expr.callee.type === "Identifier") {
                return {
                    type: "call",
                    name: expr.callee.name,
                    args: expr.arguments.map(ExpressionToIR),
                };
            } else {
                throw new ParseError(`Unsupported Calle: ${expr.callee.type}`, expr.callee);
            }
        default:
            throw new ParseError(`Unsupported Expression: ${expr.type}`, expr);
    }
}
