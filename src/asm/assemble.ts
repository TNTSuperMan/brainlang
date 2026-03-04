import type { Assembly, Program } from "./types";
import { cast_to_i8, repeat } from "./utils";

export function assemble(program: Program): string {
    let pointer = 0;
    let bf = "";
    const go = (at: number) => {
        bf += repeat(at - pointer, ">", "<");
        pointer = at;
    }
    const add = (num: number) => {
        bf += repeat(cast_to_i8(num), "+", "-");
    }
    const zero = () => bf += "[-]";
    const block_size = program.dynamic_memory_block_size + 2;
    const addr_ptr = program.static_memory_size + block_size;
    const tval_ptr = program.static_memory_size + block_size + 1;
    const addr_next_ptr = addr_ptr + block_size;
    const tval_next_ptr = tval_ptr + block_size;

    function assemble_block(codes: Assembly[]) {
        for (const asm of codes) {
            switch (asm.type) {
                case "move":
                    go(asm.source);
                    bf += "[-";
                    for (const d of asm.dests) {
                        go(d[0]);
                        add(d[1]);
                    }
                    go(asm.source);
                    bf += "]";
                    break;
                case "add":
                    go(asm.ptr);
                    add(asm.value);
                    break;
                case "set":
                    go(asm.ptr);
                    zero();
                    add(asm.value);
                    break;
                case "out":
                    go(asm.ptr);
                    bf += ".";
                    break;
                case "in":
                    go(asm.ptr);
                    bf += ",";
                    break;
                case "loop":
                    go(asm.condition);
                    bf += "[";
                    assemble_block(asm.code);
                    go(asm.condition);
                    bf += "]";
                    break;
                case "fetch": {
                    go(addr_ptr);
                    bf += "[";

                    go(addr_next_ptr); // 転送先のtmpをクリア
                    zero();

                    go(addr_ptr); // ポインタをデクリメント
                    bf += "-";

                    bf += "[-"; // ポインタをmove
                    go(addr_next_ptr);
                    bf += "+";
                    go(addr_ptr);
                    bf += "]";

                    bf += "+"; // マーク

                    go(addr_next_ptr); // ポインタをズラす
                    pointer = addr_ptr;
                    bf += "]";

                    const val_ptr = addr_ptr - 1 - asm.index;

                    go(val_ptr); // valをaddrにmove
                    bf += "[-";
                    go(addr_ptr);
                    bf += "+";
                    go(val_ptr);
                    bf += "]";
                    
                    go(addr_ptr); // addrをval/tvalにmove
                    bf += "[-";
                    go(val_ptr);
                    bf += "+";
                    go(tval_ptr);
                    bf += "+";
                    go(addr_ptr);
                    bf += "]";

                    // ZEROマークまで戻るループ＋tval移動
                    go(addr_ptr);
                    bf += "+";
                    bf += "[";

                    go(tval_ptr - block_size); // tvalクリア
                    zero();

                    go(tval_ptr); // tval移動
                    bf += "[-"
                    go(tval_ptr - block_size);
                    bf += "+";
                    go(tval_ptr);
                    bf += "]";

                    go(addr_ptr - block_size);
                    bf += "]";
                    break;
                }
                case "send": {
                    go(addr_ptr);
                    bf += "[";

                    go(addr_next_ptr); // 転送先のtmpをクリア
                    zero();
                    go(tval_next_ptr);
                    zero();

                    go(addr_ptr); // ポインタをデクリメント
                    bf += "-";

                    bf += "[-"; // ポインタをmove
                    go(addr_next_ptr);
                    bf += "+";
                    go(addr_ptr);
                    bf += "]";

                    bf += "+"; // マーク

                    go(tval_ptr); // 値をmove
                    bf += "[-";
                    go(tval_next_ptr);
                    bf += "+";
                    go(tval_ptr);
                    bf += "]";

                    go(addr_next_ptr); // ポインタをズラす
                    pointer = addr_ptr;
                    bf += "]";

                    const val_ptr = addr_ptr - 1 - asm.index;

                    bf += "+"; // マーク

                    go(val_ptr); // 代入先をクリア
                    zero();

                    go(tval_ptr); // 代入(move)
                    bf += "[-";
                    go(val_ptr);
                    bf += "+";
                    go(tval_ptr);
                    bf += "]";

                    go(addr_ptr); // ZEROマークまで戻る
                    bf += "[";
                    go(addr_ptr - block_size);
                    bf += "]";
                    break;
                }
            }
        }
    }
    assemble_block(program.code);
    return bf;
}
