import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const wikiRoot = resolve(root, 'wiki');

function walk(dir: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) found.push(...walk(full));
    else if (entry.endsWith('.md')) found.push(full);
  }
  return found;
}

const pages = walk(wikiRoot);
const relFromWiki = (abs: string) => relative(wikiRoot, abs).split('\\').join('/');

const catalog = relFromWiki(resolve(wikiRoot, 'index.md'));
const log = relFromWiki(resolve(wikiRoot, 'log.md'));
const curated = pages.map(relFromWiki).filter(path => path !== catalog && path !== log);
const index = readFileSync(resolve(wikiRoot, 'index.md'), 'utf8');

describe('wiki catalog', () => {
  it('links every curated page from index.md with a relative Markdown link', () => {
    for (const path of curated) {
      expect(index, path).toContain(`](${path})`);
    }
  });

  it('does not use wiki-style [[links]]', () => {
    for (const abs of pages) {
      const text = readFileSync(abs, 'utf8');
      expect(text, relFromWiki(abs)).not.toContain('[[');
    }
  });

  it('resolves relative links to files that exist', () => {
    const link = /\[[^\]]+\]\(([^)]+)\)/g;
    for (const abs of pages) {
      const text = readFileSync(abs, 'utf8');
      for (const match of text.matchAll(link)) {
        const target = match[1].split('#')[0].trim();
        if (!target || target.startsWith('http:') || target.startsWith('https:') || target.startsWith('mailto:')) {
          continue;
        }
        const resolved = resolve(dirname(abs), target);
        expect(statSync(resolved).isFile(), `${relFromWiki(abs)} -> ${target}`).toBe(true);
      }
    }
  });
});
