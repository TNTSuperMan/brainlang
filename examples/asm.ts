import { assemble, get_pointers } from "../src/asm";

const ptrs = get_pointers(1, 1);
console.log(assemble({
    static_memory_size: 1,
    dynamic_memory_block_size: 1,
    code: [
        { type: "set", ptr: ptrs.staticked_dynamic_ptr(3, 0), value: 6 },
        { type: "set", ptr: ptrs.addr_ptr, value: 3 },
        { type: "fetch", index: 0 },
        { type: "move", source: ptrs.fetch_val_ptr, dests: [[0, 1]] },
        { type: "out", ptr: 0 },
    ]
}));
