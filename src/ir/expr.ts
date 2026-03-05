import type { Expression, PrivateIdentifier } from "acorn";
import type { IRExpr } from "./types";

export function ExpressionToIR(expr: Expression | PrivateIdentifier): IRExpr {
    switch (expr.type) {
        case "Identifier":
            return { type: "id", id: expr.name };
        case "Literal":
            if (typeof expr.value === "number") {
                return { type: "const", value: expr.value };
            } else {
                throw new Error("No supported syntax detected");
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
                    throw new Error("No supported syntax detected");
            }
        case "CallExpression":
            if (expr.callee.type === "Identifier") {
                return {
                    type: "call",
                    name: expr.callee.name,
                    args: expr.arguments.map(e => e.type !== "SpreadElement" ? ExpressionToIR(e) : (() => { throw new Error("No supported syntax detected") })()),
                };
            } else {
                throw new Error("No supported syntax detected");
            }
        default:
            throw new Error("No supported syntax detected");
    }
}
