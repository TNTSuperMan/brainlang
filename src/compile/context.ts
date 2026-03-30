export class CompileContext {
    #using_set = new Set<number>;
    #scopes: Map<string | symbol, number>[] = [];

    alloc(name: string | undefined): number {
        let i = -1;
        while (this.#using_set.has(++i));
        this.#using_set.add(i);
        this.#scopes.at(-1)!.set(name ?? Symbol(), i);
        return i;
    }
    final_check() {
        console.assert(this.#using_set.size === 0, "Last, All memories should free");
    }
    scope(): { [Symbol.dispose](): void } {
        this.#scopes.push(new Map);
        return {
            [Symbol.dispose]: () => {
                for (const p of this.#scopes.pop()!.values()) {
                    this.#using_set.delete(p);
                }
            },
        };
    }
    find_var(name: string): number | null {
        for (let i = this.#scopes.length - 1; i >= 0; i--) {
            if (this.#scopes[i]!.has(name)) {
                return this.#scopes[i]!.get(name)!;
            }
        }
        return null;
    }
}
