import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { generateLinux } from '../scripts/prepare-linux.mjs';
import { generateWindowsAd } from '../scripts/prepare-windows-ad.mjs';

const read = (file: string) => readFile(new URL('../' + file, import.meta.url), 'utf8');
const sha = (text: string) => createHash('sha256').update(text).digest('hex');

// Mismo patrón de cierre que el Mundo SOC: la declaración de revisión del
// propietario solo vale con su registro y atada a las lecciones publicadas.
for (const [world, master, generate] of [
  ['linux', 'LINUX_MASTER_RESEARCH', generateLinux],
  ['windows-ad', 'WINDOWS_AD_MASTER_RESEARCH', generateWindowsAd],
] as const) {
  test(`${world}: la revisión del propietario declarada coincide con su registro y sus lecciones`, async () => {
    const editorial = JSON.parse(await read(`${master}/VALIDACION/CATALOGO-EDITORIAL.json`));
    const catalog = JSON.parse(await read(`src/${world}/generated/catalog.json`));
    assert.deepEqual(catalog.educationalReview, editorial.educationalReview);
    assert.equal(catalog.educationalReview.independent, false);
    assert.equal(catalog.practicalStatus, 'not_assessed');
    assert.equal(catalog.labsExecuted, false);
    const recordFile = `${master}/VALIDACION/REVISION-PROPIETARIO.json`;
    if (catalog.educationalReview.status !== 'owner_review_complete') {
      // Pendiente: no hay registro que pueda hacerse pasar por una revisión hecha.
      assert.equal(catalog.educationalReview.status, 'draft_pending_owner_review');
      assert.equal(existsSync(new URL('../' + recordFile, import.meta.url)), false);
    } else {
      const record = JSON.parse(await read(recordFile));
      assert.equal(catalog.educationalReview.kind, 'owner_editorial_review');
      assert.equal(record.reviewedAt, catalog.educationalReview.reviewedAt);
      assert.equal(record.result, catalog.educationalReview.result);
      assert.equal(record.stillOpen.length >= 2, true);
      const lessonsDigest = sha([...catalog.lessons].sort((a, b) => a.id.localeCompare(b.id))
        .map(item => `${item.id}=${item.sourceHash}`).join(':'));
      assert.equal(record.evidence.lessonsDigest, lessonsDigest);
    }
    const { catalog: generated } = await generate();
    assert.deepEqual(generated.educationalReview, catalog.educationalReview);
  });
}
