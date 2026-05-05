import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { urlFor } from './sanity';
import { block, type SimplePortableTextBlock, type SimpleSpan } from './simplePortableTextCore';

export type EditableImage = SanityImageSource | string | null | undefined;
export { block, type SimplePortableTextBlock, type SimpleSpan };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderSpan(spanValue: SimpleSpan, markDefs: SimplePortableTextBlock['markDefs'] = []): string {
  let text = escapeHtml(spanValue.text || '').replace(/\n/g, '<br>');

  for (const mark of spanValue.marks || []) {
    if (mark === 'strong') text = `<strong>${text}</strong>`;
    else if (mark === 'em') text = `<em>${text}</em>`;
    else {
      const def = markDefs.find((candidate) => candidate._key === mark);
      if (def?._type === 'link' && def.href) {
        const href = escapeHtml(def.href);
        const external = /^https?:\/\//i.test(def.href);
        const rel = external ? ' rel="noopener noreferrer" target="_blank"' : '';
        text = `<a href="${href}"${rel}>${text}</a>`;
      }
    }
  }

  return text;
}

export function renderSimplePortableText(blocks?: SimplePortableTextBlock[]): string {
  return (blocks || [])
    .filter((item) => item?._type === 'block')
    .map((item) => {
      const inner = (item.children || []).map((child) => renderSpan(child, item.markDefs)).join('');
      return inner ? `<p>${inner}</p>` : '';
    })
    .join('');
}

export function portableTextToPlainText(blocks?: SimplePortableTextBlock[]): string {
  return (blocks || [])
    .map((item) => (item.children || []).map((child) => child.text || '').join(''))
    .filter(Boolean)
    .join('\n\n');
}

export function imageUrl(source: EditableImage): string | undefined {
  if (!source) return undefined;
  if (typeof source === 'string') return source || undefined;

  try {
    return urlFor(source).auto('format').url();
  } catch {
    return undefined;
  }
}
