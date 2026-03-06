import type { Expression, PrivateIdentifier, SpreadElement } from "acorn";
import type { IRExpr } from "./types";
import { at } from "./loc";

export function ExpressionToIR(expr: Expression | PrivateIdentifier | SpreadElement): IRExpr {
    switch (expr.type) {
        case "Identifier":
            return { type: "id", id: expr.name };
        case "Literal":
            if (typeof expr.value === "number") {
                return { type: "const", value: expr.value };
            } else {
                throw new Error(`Unsupported Literal: ${expr.value} ${at(expr)}`);
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
                    throw new Error(`Unsupported Binary Operation: ${expr.operator} ${at(expr)}`);
            }
        case "CallExpression":
            if (expr.callee.type === "Identifier") {
                return {
                    type: "call",
                    name: expr.callee.name,
                    args: expr.arguments.map(ExpressionToIR),
                };
            } else {
                throw new Error(`Unsupported Calle: ${expr.callee.type} ${at(expr)}`);
            }
        default:
            throw new Error(`Unsupported Expression: ${expr.type} ${at(expr)}`);
    }
}
