export function replaceAll(
  src: string,
  oldStr: string,
  newStr: string
): string {
  return src.split(oldStr).join(newStr);
}

// Use 'URL and Filename Safe Alphabet' encoding to avoid '/' characters
// See https://tools.ietf.org/html/rfc4648#section-5
// This encoding is accepted by Buffer.from(buf, 'base64')
export function safeEncode(buf: Buffer) {
  return replaceAll(replaceAll(buf.toString('base64'), '/', '_'), '+', '-');
}

export type decodedTokenType = Array<number | string>;

export function encodeToken(data: decodedTokenType) {
  return safeEncode(Buffer.from(JSON.stringify(data)));
}
