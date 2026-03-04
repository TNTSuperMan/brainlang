export type SSAID = `${string}#${number}`;

export type SSAValue = {
    type: "const",
    value: number,
} | {
    type: "add",
    left: SSAID,
    right: SSAID,
} | {
    type: "sub",
    left: SSAID,
    right: SSAID,
} | {
    type: "mul",
    left: SSAID,
    right: SSAID,
} | {
    type: "div",
    left: SSAID,
    right: SSAID,
} | {
    type: "fetch",
    address: SSAID,
    index: number,
} | {
    type: "ref",
    value: SSAID,
} | {
    type: "call",
    name: string,
    args: SSAID[],
};
