import { allAuthorsPageQuery, legacyPagesByPathsQuery, sanityClient } from './sanity';
import {
  mergeLegacyAuthors,
  mergeLegacyPageData,
  type LegacyAuthorData,
  type LegacyPageData,
  type LegacyPageDefinition,
} from './legacyPageData';

export async function loadLegacyPages(definitions: LegacyPageDefinition[]): Promise<Map<string, LegacyPageData>> {
  const paths = definitions.map((definition) => definition.path);
  const records = await sanityClient.fetch<Partial<LegacyPageData>[]>(legacyPagesByPathsQuery, { paths });
  const byPath = new Map((records || []).filter((record) => record.path).map((record) => [record.path as string, record]));

  return new Map(definitions.map((definition) => [definition.path, mergeLegacyPageData(definition, byPath.get(definition.path))]));
}

export async function loadLegacyPage(definition: LegacyPageDefinition): Promise<LegacyPageData> {
  const pages = await loadLegacyPages([definition]);
  return pages.get(definition.path) || mergeLegacyPageData(definition);
}

export async function loadAuthors(): Promise<LegacyAuthorData[]> {
  const authors = await sanityClient.fetch<LegacyAuthorData[]>(allAuthorsPageQuery);
  return mergeLegacyAuthors(authors || []);
}
