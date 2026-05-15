export type SimpleSpan = {
  _type: 'span';
  text: string;
  marks?: string[];
};

export type SimplePortableTextBlock = {
  _type: 'block';
  style?: 'normal';
  children?: SimpleSpan[];
  markDefs?: Array<{ _key: string; _type: 'link'; href?: string }>;
};

export type EditableImage = unknown;

const span = (text: string, marks?: string[]): SimpleSpan => ({
  _type: 'span',
  text,
  ...(marks ? { marks } : {}),
});

export const block = (children: SimpleSpan[] | string): SimplePortableTextBlock => ({
  _type: 'block',
  style: 'normal',
  markDefs: [],
  children: typeof children === 'string' ? [span(children)] : children,
});
