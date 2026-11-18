export type SectionBand = 'white' | 'gray' | 'mint' | 'ink';

const FORM_TYPES = new Set(['formBlock', 'formLandingBlock', 'modernCtaBlock']);
const STATEMENT_TYPES = new Set(['statsBlock', 'testimonialBlock', 'statementBandBlock', 'proofMosaicBlock']);

/** Rotate white, gray, and light green, with up to two plain ink bands plus any form. */
export function assignBands(types: string[]): SectionBand[] {
  const count = types.length;
  const chosen = new Set<number>();
  for (let index = 0; index < count; index += 1) {
    if (FORM_TYPES.has(types[index])) chosen.add(index);
  }
  const blocked = new Set<number>();
  for (const index of chosen) {
    if (index > 0) blocked.add(index - 1);
  }
  const preferred = types
    .map((type, index) => ({ type, index }))
    .filter(({ type }) => STATEMENT_TYPES.has(type))
    .sort((a, b) => Number(b.type === 'statsBlock' || b.type === 'proofMosaicBlock') - Number(a.type === 'statsBlock' || a.type === 'proofMosaicBlock'));
  let extras = 0;
  for (const { index } of preferred) {
    if (blocked.has(index) || chosen.has(index)) continue;
    if ([...chosen].some((picked) => Math.abs(picked - index) === 1)) continue;
    chosen.add(index);
    extras += 1;
    if (extras === 2) break;
  }
  if (extras === 0) {
    for (let index = 1; index < count; index += 1) {
      if (blocked.has(index) || chosen.has(index) || FORM_TYPES.has(types[index])) continue;
      if ([...chosen].some((picked) => Math.abs(picked - index) === 1)) continue;
      chosen.add(index);
      break;
    }
  }
  const ordered = [...chosen].sort((a, b) => a - b);
  for (let index = 1; index < ordered.length; index += 1) {
    if (ordered[index] !== ordered[index - 1] + 1) continue;
    const earlier = ordered[index - 1];
    const later = ordered[index];
    const drop = FORM_TYPES.has(types[later]) ? earlier : later;
    chosen.delete(drop);
  }

  const forcedGray = new Set<number>();
  types.forEach((type, index) => {
    if (type === 'featureTabsBlock' && !chosen.has(index)) forcedGray.add(index);
  });

  const lights: SectionBand[] = ['white', 'mint', 'gray'];
  const tones: SectionBand[] = [];
  let cursor = 0;
  for (let index = 0; index < count; index += 1) {
    if (chosen.has(index)) {
      tones[index] = 'ink';
      continue;
    }
    if (forcedGray.has(index)) {
      tones[index] = 'gray';
      continue;
    }
    const previous = index > 0 ? tones[index - 1] : null;
    const nextIsGray = index + 1 < count && forcedGray.has(index + 1);
    let tone = lights[cursor % 3];
    cursor += 1;
    let guard = 0;
    while ((tone === previous || (nextIsGray && tone === 'gray')) && guard < 6) {
      tone = lights[cursor % 3];
      cursor += 1;
      guard += 1;
    }
    tones[index] = tone;
  }
  for (let index = 1; index < count; index += 1) {
    if (tones[index] !== tones[index - 1]) continue;
    const flexible = !forcedGray.has(index - 1) && !chosen.has(index - 1) ? index - 1 : index;
    if (forcedGray.has(flexible) || chosen.has(flexible)) continue;
    const before = flexible > 0 ? tones[flexible - 1] : null;
    const after = flexible + 1 < count ? tones[flexible + 1] : null;
    tones[flexible] = (['white', 'mint', 'gray'] as SectionBand[]).find((tone) => tone !== before && tone !== after) || 'mint';
  }
  return tones;
}

export function patternForPath(path: string): 'paid' | 'da' | 'topo' {
  if (path.includes('paid-media') || path.includes('performance-creative')) return 'paid';
  if (path.includes('data-activation')) return 'da';
  return 'topo';
}
