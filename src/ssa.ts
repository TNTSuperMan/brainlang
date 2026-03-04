export type SSAValue = {
    type: "const",
    value: number,
} | {
    type: "add",
    left: SSAValue,
    right: SSAValue,
} | {
    type: "sub",
    left: SSAValue,
    right: SSAValue,
} | {
    type: "mul",
    left: SSAValue,
    right: SSAValue,
} | {
    type: "div",
    left: SSAValue,
    right: SSAValue,
} | {
    type: "fetch",
    address: SSAValue,
    index: number,
} | {
    type: "ref",
    value: SSAValue,
} | {
    type: "call",
    name: string,
    args: SSAValue[],
};
