export const SITE_ORIGIN = "https://autogive.app";
export const SITE_BASE_PATH = "";
export const SITE_URL = `${SITE_ORIGIN}${SITE_BASE_PATH}`;

export function absoluteSiteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
