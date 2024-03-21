export function pad(char: string, len: number, value: string) {
  while (value.length < len) {
    value = char + value;
  }
  return value;
}

export function toSeconds(input: string) {
  const res = input.replace(/[^0-9.]/g, "");
  const secs = Number(res.slice(-2) || "0");
  const mins = Number(res.slice(-4, -2) || "0");
  const hours = Number(res.slice(0, -4) || "0");
  return secs + 60 * mins + 3600 * hours;
}

export function fromSeconds(input: number) {
  const secs = String(input % 60);
  const mins = String(Math.floor(input / 60) % 60);
  const hours = String(Math.floor(input / 3600));
  return `${hours}:${pad("0", 2, mins)}:${pad("0", 2, secs)}`;
}
