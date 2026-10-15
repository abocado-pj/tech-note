export const SITE_NAME = "Orifolio";
export const SITE_DESCRIPTION =
  "小さな気づきを残し、しくみを読み、実装へつなぐ。技術のノート・記事・本・シリーズを育てる学びの本棚。";
export const SITE_URL = "https://tech-note-opal.vercel.app/tech-note";
export const BASE_PATH = "/tech-note";
export const GITHUB_REPO_URL = "https://github.com/abocado-pj/tech-note";

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export function withBasePath(path: string) {
  if (!path || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (
    normalizedPath === BASE_PATH ||
    normalizedPath.startsWith(`${BASE_PATH}/`)
  ) {
    return normalizedPath;
  }

  return `${BASE_PATH}${normalizedPath}`;
}
