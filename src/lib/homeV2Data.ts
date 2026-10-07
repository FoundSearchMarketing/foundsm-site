/*
  Homepage (October 2026) data entry point for Astro components: the pure
  content, types and merge logic live in ./homeV2Content so Node scripts and
  tests can bundle them; this file adds the Sanity image URL builder.
*/

import { urlFor } from './sanity';
import {
  mergeHomeV2Content as mergeWithImages,
  type HomeV2SanityDoc,
  type HomeV2Content,
  type SanityImageField,
} from './homeV2Content';

export * from './homeV2Content';

const sanityImageUrl = (image: SanityImageField, width: number, height: number): string | undefined => {
  if (!image?.asset?._ref) return undefined;
  try {
    return urlFor(image as Parameters<typeof urlFor>[0]).width(width).height(height).fit('crop').auto('format').url();
  } catch {
    return undefined;
  }
};

/** Sanity homepage document → page content, with cropped Sanity image URLs. */
export function mergeHomeV2Content(doc: HomeV2SanityDoc | null | undefined): HomeV2Content {
  return mergeWithImages(doc, sanityImageUrl);
}
