const mojibakePattern = /[\u00c2\u00c3\u00d8\u00d9\u00e2]/;
const mojibakeRunPattern =
  /[\u0080-\u00ff\u0152\u0153\u0160\u0161\u0178\u017d\u017e\u0192\u02c6\u02dc\u2013\u2014\u2018\u2019\u201a\u201c\u201d\u201e\u2020\u2021\u2022\u2026\u2030\u2039\u203a\u20ac]+/g;

const cp1252Bytes = new Map<number, number>([
  [0x20ac, 0x80],
  [0x201a, 0x82],
  [0x0192, 0x83],
  [0x201e, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02c6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8a],
  [0x2039, 0x8b],
  [0x0152, 0x8c],
  [0x017d, 0x8e],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201c, 0x93],
  [0x201d, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02dc, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9a],
  [0x203a, 0x9b],
  [0x0153, 0x9c],
  [0x017e, 0x9e],
  [0x0178, 0x9f],
]);

const textDecoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-8", { fatal: false }) : null;

export function repairMojibake(value: string): string {
  if (!mojibakePattern.test(value) || !textDecoder) return value;

  return value.replace(mojibakeRunPattern, (segment) => {
    const bytes = Array.from(segment, (char) => {
      const codePoint = char.codePointAt(0) ?? 0;
      return cp1252Bytes.get(codePoint) ?? codePoint;
    });
    const repaired = textDecoder.decode(new Uint8Array(bytes));
    return repaired.includes("\uFFFD") ? segment : repaired;
  });
}

export function repairTextFields<T>(value: T): T {
  if (typeof value === "string") return repairMojibake(value) as T;
  if (Array.isArray(value)) return value.map((item) => repairTextFields(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, repairTextFields(item)]),
    ) as T;
  }
  return value;
}
