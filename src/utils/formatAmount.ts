export type AmountSuffix = "" | "k" | "M" | "B";

/**
 * Converts a numeric amount into a human-readable string with k/M/B suffixes.
 * Examples: 950 -> "950", 1200 -> "1.2k", 1500000 -> "1.5M", 2200000000 -> "2.2B".
 * If there are 4 or 5 digits after the decimal point, will show only 2 decimal digits.
 */
export function formatAmount(
	amount: number | null | undefined,
	decimals: number = 2
): string {
	if (
		amount === null ||
		amount === undefined ||
		Number.isNaN(amount as number)
	) {
		return "0";
	}

	const isNegative = amount < 0;
	const absolute = Math.abs(amount);

	let value: number = absolute;
	let suffix: AmountSuffix = "";

	if (absolute >= 1_000_000_000) {
		value = absolute / 1_000_000_000;
		suffix = "B";
	} else if (absolute >= 1_000_000) {
		value = absolute / 1_000_000;
		suffix = "M";
	} else if (absolute >= 1_000) {
		value = absolute / 1_000;
		suffix = "k";
	}

	let valueStr = value.toString();
	if (valueStr.includes(".")) {
		const [integer, fractional] = valueStr.split(".");
		if (fractional.length === 4 || fractional.length === 5) {
			// Reduce to 2 decimal places if 4 or 5 digits after decimal point
			const formatted = trimTrailingZeros(Number(value).toFixed(2));
			return `${isNegative ? "-" : ""}${formatted}${suffix}`;
		}
	}

	const formatted = trimTrailingZeros(value.toFixed(decimals));
	return `${isNegative ? "-" : ""}${formatted}${suffix}`;
}

function trimTrailingZeros(input: string): string {
	if (!input.includes(".")) return input;
	return input.replace(/\.0+$/u, "").replace(/(\.\d*?)0+$/u, "$1");
}

export default formatAmount;
