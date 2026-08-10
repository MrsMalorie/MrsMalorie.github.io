const ORDINALS = {
    one: "st",
    two: "nd",
    few: "rd",
    other: "th",
}

export function getOrdinal(num: number): string {
    const numInt = Math.round(num);

    const rule = new Intl.PluralRules('en-US', { type: "ordinal" });
    const selected = rule.select(numInt);

    return `${numInt}${ORDINALS[selected as keyof typeof ORDINALS]}`
}