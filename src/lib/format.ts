export function inr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function cleanText(value: unknown, max: number) {
  if (typeof value !== "string") return null;
  const text = value.replace(/\s+/g, " ").trim();
  if (!text) return null;
  return text.slice(0, max);
}

export function cleanBlock(value: unknown, max: number) {
  if (typeof value !== "string") return null;
  const text = value.replace(/\r\n/g, "\n").trim();
  if (!text) return null;
  return text.slice(0, max);
}
