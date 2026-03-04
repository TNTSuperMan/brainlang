export interface Program {
    static_memory_size: number;
    dynamic_memory_block_size: number;
    code: Assembly[];
}

export type Pointer = number;

export type Assembly = {
    type: "move",
    source: Pointer,
    dests: [Pointer, number][],
} | {
    type: "add",
    ptr: Pointer,
    value: number,
} | {
    type: "set",
    ptr: Pointer,
    value: number,
} | {
    type: "out",
    ptr: Pointer,
} | {
    type: "in",
    ptr: Pointer,
} | {
    type: "loop",
    condition: Pointer,
    code: Assembly[],
} | {
    type: "fetch" | "send",
    index: number,
}
