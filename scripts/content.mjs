import { createHash } from 'node:crypto';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { toString } from 'mdast-util-to-string';
import { visit } from 'unist-util-visit';

const parser = unified().use(remarkParse).use(remarkGfm);
export const hash = value => createHash('sha256').update(value).digest('hex');
export const slug = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'seccion';

// The original is never written. Reports record categories and lines, never values.
export function sanitize(source) {
  const redactions = [];
  const rules = [
    ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
    ['jwt', /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g],
    ['token', /\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-(?:proj-)?[A-Za-z0-9_-]{20,}|AKIA[A-Z0-9]{16})\b/g],
    ['credential', /\b(?:password|passwd|api[_-]?key|access[_-]?token|client[_-]?secret|AccountKey|SharedAccessSignature)\s*[=:]\s*["']?[^\s|;"'`<>]{5,}["']?/gi],
    ['email', /\b[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}\b/g],
    ['identifier', /\b[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\b/gi],
    ['ip-address', /\b(?:\d{1,3}\.){3}\d{1,3}\b/g],
    ['user-path', /(?:\/home\/[^/\s`"'|]+|C:\\Users\\[^\\\s`"'|]+)/gi],
    ['url-secret', /(?:[?&](?:sig|token|key|secret|password|code|client_secret|access_token)=)[^&\s)"'`<>]+/gi],
    ['url-credentials', /https?:\/\/[^\s/@:]+:[^\s/@]+@/gi],
  ];
  // Apply replacements from the end so all recorded line numbers refer to the source.
  const matches = [];
  for (const [kind, pattern] of rules) {
    for (const match of source.matchAll(pattern)) {
      matches.push({ start: match.index, end: match.index + match[0].length, kind });
    }
  }
  matches.sort((a, b) => a.start - b.start || b.end - a.end);
  const accepted = matches.filter((item, i, all) => !all.slice(0, i).some(prev => prev.start <= item.start && prev.end > item.start));
  let text = source;
  for (const item of accepted.toReversed()) {
    const line = source.slice(0, item.start).split('\n').length;
    redactions.unshift({ kind: item.kind, line });
    const hidden = `[DATO OCULTO: ${item.kind}]` + '\n'.repeat((source.slice(item.start, item.end).match(/\n/g) || []).length);
    text = text.slice(0, item.start) + hidden + text.slice(item.end);
  }
  return { text, redactions };
}

function headingsFor(text) {
  const tree = parser.parse(text);
  const headings = [];
  visit(tree, 'heading', node => {
    headings.push({ title: toString(node), depth: node.depth, line: node.position.start.line,
      offset: node.position.start.offset, end: node.position.end.offset });
  });
  return { tree, headings };
}

export function parseDocument(original) {
  const { text, redactions } = sanitize(original);
  const { tree, headings } = headingsFor(text);
  const chapters = headings.filter(h => h.depth === 1);
  if (!chapters.length) throw new Error('SC-200.md no contiene capítulos H1. No se inventará una estructura.');
  const modules = [], lessons = [], unresolved = [], references = [];
  const addLesson = (moduleId, title, start, end, syntheticTitle = false) => {
    const markdown = text.slice(start, end);
    const localHeadings = headings.filter(h => h.offset >= start && h.offset < end);
    const idBase = `${moduleId || 'documento'}/${slug(title)}`;
    const occurrence = lessons.filter(l => l.id.replace(/-\d+$/, '') === idBase).length + 1;
    const id = `${idBase}-${occurrence}`;
    const line = text.slice(0, start).split('\n').length;
    // Occurrence suffixes avoid collisions even when source headings repeat verbatim.
    const seen = new Map();
    const sections = localHeadings.map(h => {
      const key = slug(h.title), n = (seen.get(key) || 0) + 1;
      seen.set(key, n);
      return { title: h.title, depth: h.depth, line: h.line, anchor: `${key}-${n}` };
    });
    const lesson = { id, moduleId, title, syntheticTitle, line, endLine: text.slice(0, end).split('\n').length - (text[end - 1] === '\n' ? 1 : 0),
      start, end, version: hash(markdown), sections, markdown };
    lessons.push(lesson);
    return id;
  };
  let prelude = null;
  if (text.slice(0, chapters[0].offset).trim()) {
    prelude = addLesson(null, 'Apertura del documento', 0, chapters[0].offset, true);
  }
  chapters.forEach((chapter, index) => {
    const end = chapters[index + 1]?.offset ?? text.length;
    const id = `capitulo-${slug(chapter.title)}`;
    const h2 = headings.filter(h => h.depth === 2 && h.offset > chapter.offset && h.offset < end);
    const ids = [];
    if (!h2.length || text.slice(chapter.end, h2[0].offset).trim()) {
      ids.push(addLesson(id, chapter.title, chapter.offset, h2[0]?.offset ?? end));
    }
    h2.forEach((heading, i) => {
      const start = i === 0 && !ids.length ? chapter.offset : heading.offset;
      ids.push(addLesson(id, heading.title, start, h2[i + 1]?.offset ?? end));
    });
    modules.push({ id, title: chapter.title, line: chapter.line, lessonIds: ids });
  });
  const ordered = lessons.toSorted((a, b) => a.start - b.start);
  // Fail closed on accidental omissions, duplication, or broken boundaries.
  if (ordered.map(l => l.markdown).join('') !== text) throw new Error('La partición no conserva todo el Markdown.');
  visit(tree, node => {
    if (node.type !== 'link' && node.type !== 'image') return;
    const target = node.url;
    if (/^https:\/\//i.test(target) && node.type === 'link') references.push({ line: node.position.start.line, kind: 'external-link' });
    else unresolved.push({ line: node.position.start.line, kind: node.type, reason: 'No se carga ni se copia un recurso no verificado.' });
  });
  // Preserve Obsidian references as readable placeholders, never fetch assets blindly.
  for (const match of text.matchAll(/!?\[\[([^\]]+)\]\]/g)) {
    unresolved.push({ line: text.slice(0, match.index).split('\n').length, kind: match[0].startsWith('!') ? 'obsidian-embed' : 'obsidian-link', reason: 'Recurso de Obsidian pendiente de resolver.' });
  }
  return { text, modules, lessons, prelude, report: {
    source: 'SC-200.md', sourceHash: hash(original), sanitizedHash: hash(text),
    sourceLines: original.split('\n').length, modules: modules.length, lessons: lessons.length,
    headings: headings.length, codeBlocks: tree.children.filter(n => n.type === 'code').length,
    externalLinks: references.length, unresolved, redactions,
    partitionVerified: true,
  } };
}
