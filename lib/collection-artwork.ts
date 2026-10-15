const seriesArtwork: Record<string, string> = {
  "world-file-extensions": "/images/orifolio/series-formats.png",
  "lambda-api-boundaries": "/images/orifolio/series-lambda.png",
  "rails-raw-sql": "/images/orifolio/series-sql.png",
};
const noteArtwork: Record<string, string> = {
  "aws/lambda-permission-checklist": "/images/orifolio/note-lambda.png",
  "rails/optional-locals-contract": "/images/orifolio/note-rails.png",
  "site-design/content-model": "/images/orifolio/note-content.png",
};
export const getSeriesArtwork = (slug: string) => seriesArtwork[slug];
export const getNoteArtwork = (slug: string) => noteArtwork[slug];
