import type { SavedLocation } from '../types/weather';

const DEFAULT_DUHOK_IMAGE = '/src/assets/images/duhok_city_skyline_1795106293167.jpg';

const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/w/api.php';

const BLOCKED_IMAGE_PATTERNS = [
  '.svg',
  '.gif',
  'flag_of_',
  'coat_of_arms',
  'locator',
  'location_map',
  'blank_map',
  'emblem',
  'seal_of_',
  'logo',
  'signature',
  'collage',
  'montage',
  'icon',
  'map_of_',
];

const imageCache = new Map<string, string | null>();

interface WikiPageImage {
  source?: string;
  width?: number;
  height?: number;
}

interface WikiPage {
  pageid?: number;
  title?: string;
  thumbnail?: WikiPageImage;
  original?: WikiPageImage;
}

function isUsableCityPhoto(url: string | undefined, width?: number, height?: number): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  if (BLOCKED_IMAGE_PATTERNS.some((pattern) => lower.includes(pattern))) {
    return false;
  }
  if (width && height && width < 400) {
    return false;
  }
  if (width && height && height > width * 1.35) {
    // Avoid tall portrait crops for full-screen landscape backgrounds
    return false;
  }
  return true;
}

async function queryWikipediaByTitles(
  titles: string[],
  signal?: AbortSignal,
): Promise<string | null> {
  if (titles.length === 0) return null;

  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    prop: 'pageimages',
    piprop: 'thumbnail|original',
    pithumbsize: '1600',
    redirects: '1',
    titles: titles.join('|'),
  });

  const res = await fetch(`${WIKIPEDIA_API_URL}?${params.toString()}`, { signal });
  if (!res.ok) return null;

  const data = (await res.json()) as {
    query?: { pages?: Record<string, WikiPage> };
  };

  const pages = Object.values(data.query?.pages ?? {});
  for (const page of pages) {
    const thumb = page.thumbnail;
    const orig = page.original;
    if (thumb?.source && isUsableCityPhoto(thumb.source, thumb.width, thumb.height)) {
      return thumb.source;
    }
    if (orig?.source && isUsableCityPhoto(orig.source, orig.width, orig.height)) {
      return orig.source;
    }
  }
  return null;
}

async function queryWikipediaByCoords(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<string | null> {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    origin: '*',
    generator: 'geosearch',
    ggscoord: `${latitude}|${longitude}`,
    ggsradius: '10000',
    ggslimit: '8',
    prop: 'pageimages',
    piprop: 'thumbnail',
    pithumbsize: '1600',
  });

  const res = await fetch(`${WIKIPEDIA_API_URL}?${params.toString()}`, { signal });
  if (!res.ok) return null;

  const data = (await res.json()) as {
    query?: { pages?: Record<string, WikiPage> };
  };

  const pages = Object.values(data.query?.pages ?? {});
  for (const page of pages) {
    const thumb = page.thumbnail;
    if (thumb?.source && isUsableCityPhoto(thumb.source, thumb.width, thumb.height)) {
      return thumb.source;
    }
  }
  return null;
}

export function getInitialCityImage(location: SavedLocation): string | null {
  const normalized = location.name.trim().toLowerCase();
  if (location.id === '98463' || normalized === 'duhok' || normalized === 'dahuk') {
    return DEFAULT_DUHOK_IMAGE;
  }
  return imageCache.get(location.id) ?? null;
}

export async function fetchCityBackgroundImage(
  location: SavedLocation,
  signal?: AbortSignal,
): Promise<string | null> {
  const normalized = location.name.trim().toLowerCase();
  if (location.id === '98463' || normalized === 'duhok' || normalized === 'dahuk') {
    return DEFAULT_DUHOK_IMAGE;
  }

  const cacheKey = `${location.id}:${location.latitude.toFixed(2)},${location.longitude.toFixed(2)}`;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey) ?? null;
  }

  try {
    const candidateTitles = [
      location.admin1 ? `${location.name}, ${location.admin1}` : null,
      `${location.name}, ${location.country}`,
      location.name,
    ].filter((val): val is string => Boolean(val));

    let imageUrl = await queryWikipediaByTitles(candidateTitles, signal);

    if (!imageUrl) {
      imageUrl = await queryWikipediaByCoords(location.latitude, location.longitude, signal);
    }

    imageCache.set(cacheKey, imageUrl);
    return imageUrl;
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      throw err;
    }
    return null;
  }
}
