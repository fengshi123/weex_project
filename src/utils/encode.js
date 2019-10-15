export function encodeImageUrl (c) {
  const encodeMap = {
    '(': escape('('),
    ')': escape(')'),
    '#': escape('#')
  }
  if (encodeMap[c] !== undefined) {
    return encodeMap[c];
  }
  return c;
}
