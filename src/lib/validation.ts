export function isValidIndianMobile(value: string): boolean {
  const input = value.trim();
  if (!input || !/^\+?[0-9()\s.-]+$/.test(input)) return false;

  const digits = input.replace(/\D/g, "");
  const mobile =
    digits.length === 10
      ? digits
      : digits.length === 12 && digits.startsWith("91")
        ? digits.slice(2)
        : "";

  return /^[6-9]\d{9}$/.test(mobile);
}
