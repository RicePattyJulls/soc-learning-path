import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { toString } from 'mdast-util-to-string';
import { hash } from './content.mjs';
import { pilots, enrichment } from './activities.mjs';
import { v25 } from './v25/index.mjs';

const parser = unified().use(remarkParse).use(remarkGfm);
export function buildEducation(lesson, phase = 'full') {
  const definitions = phase === 'pilots' ? pilots : [...pilots, ...enrichment, ...v25];
  if(new Set(definitions.map(d=>d.lessonId)).size!==definitions.length)throw Error('No sobrescribir actividades originales');
  const authored = definitions.find(d => d.lessonId === lesson.id);
  const markdown = lesson.markdown, tree = parser.parse(markdown), headings = tree.children.filter(n => n.type === 'heading');
  const slice = node => markdown.slice(node.position.start.offset, node.position.end.offset);
  const source = (quote, start) => {
    const at = start ?? markdown.indexOf(quote);
    if (at < 0 || markdown.slice(at, at + quote.length) !== quote) throw new Error(`Evidencia no encontrada: ${lesson.id}: ${quote.slice(0, 80)}`);
    const line = lesson.line + markdown.slice(0, at).split('\n').length - 1;
    return { lessonId: lesson.id, sourceVersion: lesson.version, line, endLine: line + quote.split('\n').length - 1, quote };
  };
  let heading = null, steps = [];
  const addStep = (node, data, quote = slice(node)) => {
    const nodeAt = node.position.start.offset;
    const next = headings.find(h => h.position.start.offset > nodeAt && h.depth <= (heading?.depth || 1));
    const context = markdown.slice(heading?.position.start.offset || 0, next?.position.start.offset ?? markdown.length);
    const ref = source(quote, nodeAt);
    const key = hash(lesson.id + ':' + nodeAt + ':' + JSON.stringify(data)).slice(0, 12);
    steps.push({ id: `paso-${key}`, title: heading ? toString(heading) : 'Recorrido inicial', ...data,
      source: ref, context, teaching: authored?.notes?.find(n => quote.includes(n.quote))?.text });
  };
  for (const node of tree.children) {
    if (node.type === 'heading') { heading = node; continue; }
    if (node.type === 'thematicBreak') continue;
    if (node.type === 'table') {
      const headers = node.children[0].children.map(slice);
      let batch = [], words = 0;
      const flush = () => {
        if (!batch.length) return;
        addStep(node, { kind: 'comparison', cards: batch.map(row => ({
          title: toString(row.children[0]) || 'Comparación del documento',
          fields: row.children.map((cell, i) => ({ label: headers[i]?.trim() || `Columna ${i + 1}`, markdown: slice(cell) })),
        })) }); batch = []; words = 0;
      };
      for (const row of node.children.slice(1)) {
        const count = toString(row).split(/\s+/).length;
        if (batch.length && (batch.length >= 3 || words + count > 240)) flush();
        batch.push(row); words += count;
      }
      flush(); continue;
    }
    if (node.type === 'list' && toString(node).split(/\s+/).length > 180) {
      for (const item of node.children) addStep(item, { kind: node.ordered ? 'procedure' : 'concept', markdown: slice(item) });
      continue;
    }
    addStep(node, { kind: node.type === 'code' ? 'code' : node.type === 'blockquote' ? 'key-concept' : node.type === 'list' && node.ordered ? 'procedure' : 'explanation', markdown: slice(node) });
  }
  if (!steps.length) throw new Error(`Lección sin pasos: ${lesson.id}`);
  // All answers are authored; automatic segmentation does not manufacture assessments.
  const questions = (authored?.questions || []).map(q => {
    if (!q.explanation || q.evidence.length === 0) throw new Error(`Pregunta sin justificación: ${q.id}`);
    if (new Set(q.options.map(o => o.id)).size !== q.options.length) throw new Error(`Opciones duplicadas: ${q.id}`);
    if (!q.solution.length || q.solution.some(id => !q.options.some(o => o.id === id))) throw new Error(`Solución inválida: ${q.id}`);
    if (q.type === 'order' && q.solution.length !== q.options.length) throw new Error(`Procedimiento incompleto: ${q.id}`);
    if (q.type === 'match' && q.solution.length !== q.rows.length) throw new Error(`Relación incompleta: ${q.id}`);
    return { ...q, references: q.evidence.map(quote => source(quote)), evidence: undefined };
  });
  if (authored && (!questions.some(q => q.phase === 'practice') || !questions.some(q => q.phase === 'assessment'))) throw new Error(`Falta práctica o evaluación: ${lesson.id}`);
  const draft = { schemaVersion: 1, sourceVersion: lesson.version, lessonId: lesson.id,
    coverage: authored ? 'reviewed' : 'guided', pilot: !!authored?.pilot,
    introduction: authored?.introduction || `Estudiarás «${lesson.title}» en pasos cortos. Se conservan las condiciones y los ejemplos del apartado; sus actividades evaluables todavía necesitan revisión pedagógica.`,
    goals: authored?.goals || ['Recorrer los conceptos del apartado.', 'Consultar sus condiciones, tablas y ejemplos en contexto.', 'Localizar los puntos que necesites repasar.'],
    steps, questions, summary: authored?.summary || [],
    reviewRequired: !authored,
  };
  if(authored?.review)draft.review=authored.review;
  return { ...draft, revision: hash(JSON.stringify(draft)) };
}
