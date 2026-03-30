import type { Assembly } from "../asm";
import type { IRExpr } from "../ir/types";
import type { CompileContext } from "./context";

export function* compileExpression(ctx: CompileContext, expr: IRExpr, ptr: number): Generator<Assembly> {
    using scope = ctx.scope();

    switch (expr.type) {
        case "const": {
            yield { type: "set", ptr, value: expr.value };
            break;
        }
        case "add": {
            if (expr.left.type === "const" && expr.right.type === "const") {
                yield { type: "set", ptr, value: expr.left.value + expr.right.value };
            } else if (expr.left.type === "const") {
                yield { type: "set", ptr, value: expr.left.value };
                const p = ctx.alloc(undefined);
                yield* compileExpression(ctx, expr.right, p);
                yield { type: "move", source: p, dests: [[ptr, 1]] };
            } else if (expr.right.type === "const") {
                yield { type: "set", ptr, value: expr.right.value };
                const p = ctx.alloc(undefined);
                yield* compileExpression(ctx, expr.left, p);
                yield { type: "move", source: p, dests: [[ptr, 1]] };
            } else {
                yield* compileExpression(ctx, expr.left, ptr);
                const p = ctx.alloc(undefined);
                yield* compileExpression(ctx, expr.right, p);
                yield { type: "move", source: p, dests: [[ptr, 1]] };
            }
            break;
        }
        case "sub":{
            if (expr.left.type === "const" && expr.right.type === "const") {
                yield { type: "set", ptr, value: expr.left.value - expr.right.value };
            } else if (expr.left.type === "const") {
                yield { type: "set", ptr, value: expr.left.value };
                const p = ctx.alloc(undefined);
                yield* compileExpression(ctx, expr.right, p);
                yield { type: "move", source: p, dests: [[ptr, -1]] };
            } else if (expr.right.type === "const") {
                yield { type: "set", ptr, value: expr.right.value };
                const p = ctx.alloc(undefined);
                yield* compileExpression(ctx, expr.left, p);
                yield { type: "move", source: p, dests: [[ptr, 1]] };
            } else {
                yield* compileExpression(ctx, expr.left, ptr);
                const p = ctx.alloc(undefined);
                yield* compileExpression(ctx, expr.right, p);
                yield { type: "move", source: p, dests: [[ptr, 1]] };
            }
            break;
        }
    }
}
