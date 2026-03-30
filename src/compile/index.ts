import type { Program } from "../asm";
import type { IRStatement } from "../ir/types";
import { CompileContext } from "./context";
import { compileStatements } from "./statements";

export function compile(ir_arr: IRStatement[]): Program {
    let max_i = 0;
    let i = 0;
    const ctx = new CompileContext;

    console.log([...compileStatements(ctx, ir_arr)]);
    
    return {
        static_memory_size: max_i,
        dynamic_memory_block_size: 0,
        code: [],
    };
}
