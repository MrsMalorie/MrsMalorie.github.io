export function count(start: number, length: number, step: number = 1): number[] {
    if (length <= 0) {
        return [];
    }

    return Array.from({ length: length }, (_, idx: number) => (
        start + idx * step
    ));
}

export function range(start: number, end: number, step: number = 1): number[] {
    const length: number = Math.floor((end - start) / step);
    return count(start, length, step);
}