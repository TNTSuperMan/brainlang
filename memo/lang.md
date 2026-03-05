## 1. js-like
```js
function main() {
    for (let i = 0; i < 10; i++) {
        const ascii = 48 + i;
        out(ascii);
    }
    return 20;
}

out(main());

```

## 2. IR/解析
- 関数呼び出しは全部インライン展開します、返り値も同様です
- 表示上の言語はjsとしてますが実際はIRです
- Alloc/Freeはヒープメモリじゃなくて解析時の静的メモリ割り当てにおける概念です

```js
let i = 0; // Alloc 0
while (i < 10) {
    let ascii = 48 + i; // Alloc 1, Clone 0
    out(ascii);
    // No longer used, Free 1(ascii)
    i += 1;
}
// No longer used, Free 0(i)

out(20);

```

## 3. アセンブリ
- 疑似的なものです

```
SET [0], 0
LESSTHAN [0], 10, [1] ; マクロ的なやつ、[0]<10の結果0/1を[1]に
LOOP [1] {
    SET [1], 48
    SET [2], 0
    MOVE [0] -> [2]*1
    MOVE [2] -> [0]*1, [1]*1

    OUT [1]

    ADD [0], 1

    LESSTHAN [0], 10, [1]
}

SET [0], 20
OUT [0]

```
