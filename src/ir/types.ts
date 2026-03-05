export type IRExpr = {
    type: "const",
    value: number,
} | {
    type: "add" | "sub" | "mul" | "div",
    left: IRExpr,
    right: IRExpr,
} | {
    type: "fetch",
    address: IRExpr,
    index: number,
} | {
    type: "id",
    id: string,
} | {
    type: "call",
    name: string,
    args: IRExpr[],
};

export type IRStatement = {
    type: "vardef",
    id: string,
    value: IRExpr | undefined,
} | {
    type: "assign",
    id: string,
    value: IRExpr,
} | {
    type: "call",
    name: string,
    args: IRExpr[],
} | {
    type: "while",
    condition: IRExpr,
    body: IRStatement,
} | {
    type: "if",
    condition: IRExpr,
    body: IRStatement,
    else?: IRStatement,
} | {
    type: "block",
    body: IRStatement[],
}
