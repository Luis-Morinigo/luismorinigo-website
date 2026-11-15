export interface TextSegment {
  text: string;
  strong: boolean;
}

/**
 * Splits content text on `**…**` so a phrase can be emphasised from the
 * content files without writing HTML there. Unpaired markers stay as text.
 */
export function parseEmphasis(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const pattern = /\*\*(.+?)\*\*/g;
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > last) segments.push({ text: text.slice(last, match.index), strong: false });
    segments.push({ text: match[1], strong: true });
    last = match.index + match[0].length;
  }
  if (last < text.length) segments.push({ text: text.slice(last), strong: false });
  return segments;
}
