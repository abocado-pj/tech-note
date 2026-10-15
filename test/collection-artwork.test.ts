import assert from "node:assert/strict";
import fs from "node:fs";
import { it } from "node:test";
import { getAllNotes } from "../lib/notes";
import { getSeries } from "../lib/articles";
import { getSeriesArtwork } from "../lib/collection-artwork";

it("gives every published note and series its own locally available thumbnail", () => {
  const notes = getAllNotes().map((note) => note.thumbnail);
  const series = getSeries().map((item) => getSeriesArtwork(item.slug));
  const images = [...notes, ...series];
  assert.equal(notes.length, 3);
  assert.equal(series.length, 3);
  assert.equal(new Set(images).size, images.length);
  for (const image of images) {
    assert.ok(image, "published collection has no artwork");
    const bytes = fs.readFileSync(`public${image}`);
    assert.equal(bytes.subarray(1, 4).toString(), "PNG");
  }
});
