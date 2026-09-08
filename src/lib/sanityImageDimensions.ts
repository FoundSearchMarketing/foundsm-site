/**
 * Helpers for reading intrinsic image dimensions from a Sanity asset reference.
 *
 * Sanity asset IDs encode the original dimensions, e.g.
 * `image-439b6709d65a3f49855ec184f4936c8a8c584f55-1390x479-png`.
 */

export interface SanityImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

/** Hero images at or above this width:height ratio are treated as panoramic banners. */
export const PANORAMIC_ASPECT_RATIO = 1.9;

export function parseSanityImageDimensions(ref: string | undefined | null): SanityImageDimensions | undefined {
  if (typeof ref !== 'string') return undefined;
  const match = ref.match(/-(\d+)x(\d+)-[a-z0-9]+$/i);
  if (!match) return undefined;

  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!width || !height) return undefined;

  return { width, height, aspectRatio: width / height };
}

/**
 * Whether a featured image should be cropped to the standard 3:2 hero frame.
 * Panoramic banners are served whole instead, so their edges are not cut off.
 * Unknown dimensions fall back to cropping, matching the historical behaviour.
 */
export function shouldCropToHeroFrame(ref: string | undefined | null): boolean {
  const dimensions = parseSanityImageDimensions(ref);
  if (!dimensions) return true;
  return dimensions.aspectRatio < PANORAMIC_ASPECT_RATIO;
}
