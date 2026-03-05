export type SSAID = `${string}#${number}` | `${string}/branch#${number}`;

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

export type SSAStatement = {
    type: "var",
    id: SSAID,
    value: SSAValue,
} | {
    type: "call",
    name: string,
    args: SSAID[],
} | {
    type: "while",
    condition: SSAID,
} | {
    type: "if",
    branches: {
        condition: SSAValue,
        code: SSAStatement[],
    }[],
    default?: SSAStatement[],
}
