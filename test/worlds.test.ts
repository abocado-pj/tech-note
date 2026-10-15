import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getAllArticles } from '../lib/articles';
import { READING_WORLDS } from '../lib/worlds';

test('exhibitions link only to real published articles and keep unassigned objects in preparation', () => {
 const articles = new Set(getAllArticles().map(article => article.slug));
 for (const world of READING_WORLDS) {
  const ids = new Set<string>();
  for (const object of world.groups.flatMap(group => group.objects)) {
   assert.ok(!ids.has(object.id), `${world.id}: duplicate ${object.id}`); ids.add(object.id);
   for (const slug of object.articles) assert.ok(articles.has(slug), `${world.id}/${object.id}: missing ${slug}`);
  }
 }
 const aws = READING_WORLDS.find(world => world.id === 'aws')!;
 assert.equal(aws.groups.flatMap(group => group.objects).length, 29);
 assert.deepEqual(aws.groups.flatMap(group => group.objects).find(object => object.id === 'sqs')!.articles, []);
});
