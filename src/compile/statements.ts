import type { Assembly } from "../asm";
import type { IRStatement } from "../ir/types";
import type { CompileContext } from "./context";

export function* compileStatements(ctx: CompileContext, statements: IRStatement[]): Generator<Assembly> {
    using _scope = ctx.scope();

    for (const state of statements) {
        switch (state.type) {
            case "vardef":
                const ptr = ctx.alloc(state.id);
                break;
            case "assign":
                break;
            case "block":
                yield* compileStatements(ctx, state.body);
                break;
        }
    }
}
