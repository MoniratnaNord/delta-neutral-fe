export type AmountSuffix = "" | "k" | "M" | "B";

/**
 * Converts a numeric amount into a human-readable string with k/M/B suffixes.
 * Examples: 950 -> "950", 1200 -> "1.2k", 1500000 -> "1.5M", 2200000000 -> "2.2B".
 */
export function formatAmount(amount: number | null | undefined, decimals: number = 2): string {
  if (amount === null || amount === undefined || Number.isNaN(amount as number)) {
    return "-";
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

  const formatted = trimTrailingZeros(value.toFixed(decimals));
  return `${isNegative ? "-" : ""}${formatted}${suffix}`;
}

function trimTrailingZeros(input: string): string {
  if (!input.includes(".")) return input;
  return input.replace(/\.0+$/u, "").replace(/(\.\d*?)0+$/u, "$1");
}

export default formatAmount;


