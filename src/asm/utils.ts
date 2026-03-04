import type { Pointer } from "./types";

export const repeat = (size: number, positive: string, negative: string) => size >= 0
    ? positive.repeat(size)
    : negative.repeat(Math.abs(size));

const caster = new Int8Array(1);
export const cast_to_i8 = (num: number) => {
    caster[0] = num;
    return caster[0];
}

export const get_pointers = (static_size: number, dynamic_block: number) => {
    const block_size = dynamic_block + 2;
    return {
        block_size,
        addr_ptr: static_size + block_size,
        send_val_ptr: static_size + block_size + 1,
        fetch_val_ptr: static_size + 1,
        staticked_dynamic_ptr(addr: number, index: number): Pointer {
            return static_size + block_size + (addr * block_size) - 1 - index;
        },
    }
}
