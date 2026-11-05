// Traitement des images : /images-source/ -> /public/images/
// Règle : on ne touche NI aux couleurs NI au contenu. On redimensionne et on convertit en WebP, c'est tout.
import sharp from 'sharp';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'images-source');
const out = join(root, 'public', 'images');

// Correspondance fichier d'origine -> slug de la peluche (voir docs/PHASE-0-inventaire.md)
const MAP = {
  'peluche_redbull_rose.jpeg': 'edition-rose',
  'peluche_redbull_blanche.jpeg': 'edition-coco',
  'peluche_redbull_bleu.jpeg': 'edition-hiver',
  'peluche_redbull.jpeg': 'edition-classique',
  'peluche_Celsius.jpeg': 'petillante-orange',
  'peluche_monster_vert.jpeg': 'ultra-verte',
  'peluche_monster_violet.jpeg': 'ultra-violette',
  'peluche_monster_bleu.jpeg': 'ultra-bleue',
  'peluche_monster_rose.jpeg': 'ultra-rose',
  'peluche_monster_blanc.jpeg': 'ultra-blanche',
  'peluche_monster_organge.jpeg': 'ultra-orange',
  'peluche_monster_noir.jpeg': 'ultra-noire',
};

await mkdir(out, { recursive: true });
const manifest = [];

for (const [file, slug] of Object.entries(MAP)) {
  const input = join(src, file);
  // Image absente : on la saute (la peluche s'affichera en « bientôt disponible »)
  if (!(await stat(input).catch(() => null))) { console.log('– absente :', file); continue; }
  const meta = await sharp(input).metadata();
  const base = `peluche-${slug}-face-1`;

  // Master : taille d'origine (jamais agrandie), WebP qualité 82
  const master = join(out, `${base}.webp`);
  await sharp(input).webp({ quality: 82 }).toFile(master);

  // Version moyenne pour les cartes produit (600 px)
  const card = join(out, `${base}-600.webp`);
  await sharp(input).resize(600, 600, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(card);

  // Miniature de pastille carrée (300 px)
  const thumb = join(out, `${base}-300.webp`);
  await sharp(input).resize(300, 300, { fit: 'cover' }).webp({ quality: 80 }).toFile(thumb);

  // Image Open Graph 1200x630 : la photo entière posée sur un fond blanc (aucun recadrage du produit)
  const og = join(out, `${base}-og.jpg`);
  const inner = await sharp(input).resize(600, 600, { fit: 'inside' }).toBuffer();
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#ffffff' } })
    .composite([{ input: inner, gravity: 'center' }])
    .jpeg({ quality: 82 })
    .toFile(og);

  manifest.push({
    source: file,
    peluche: slug,
    vue: 'face',
    largeur: meta.width,
    hauteur: meta.height,
    fichiers: {
      master: `${base}.webp`, poids_master_ko: Math.round((await stat(master)).size / 1024),
      carte: `${base}-600.webp`, miniature: `${base}-300.webp`, og: `${base}-og.jpg`,
    },
  });
  console.log('✓', file, '->', base);
}

await writeFile(join(out, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`\n${manifest.length} images traitées -> public/images/`);
