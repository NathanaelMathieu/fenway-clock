const world = 'world';

export default function hello(world: string = "world"): string {
    return `Hello ${world}`;
}

hello()