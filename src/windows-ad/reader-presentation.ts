import type { LessonContent } from './types';

export const readerStages = [
  { id: 'mision', title: 'Tu misión' }, { id: 'aprende', title: 'Aprende' },
  { id: 'practica', title: 'Practica' }, { id: 'conecta', title: 'Conecta ideas' },
  { id: 'evalua', title: 'Demuestra' },
] as const;
export const stripHeading = (markdown: string) => markdown.replace(/^##[^\n]*\n+/, '');
export function learningMarkdown(content: LessonContent, index: number) {
  const markdown = content.study[index].markdown;
  // The objective belongs in the mission. The learning card already has its
  // heading, so the same objective/title need not be printed a second time.
  const mechanism = index === 0 ? markdown.slice(markdown.indexOf('## 2. Comprende el mecanismo')) : markdown;
  return stripHeading(mechanism);
}
export function missionIntroduction(content: LessonContent) {
  const paragraph = learningMarkdown(content, 0).split('\n\n')[0];
  return paragraph.match(/^.*?[.!?](?:\s|$)/)?.[0].trim() ?? paragraph;
}
export function connectionMarkdown(content: LessonContent) {
  return stripHeading(content.study[2].markdown.split(/^## 7\./m)[0]);
}
export function sourceMarkdown(content: LessonContent) {
  const questions = content.questions.map((q, i) => `### Pregunta ${i + 1}\n\n${q.prompt}\n\n${q.options.map(o => `- ${o.id}. ${o.text}`).join('\n')}`).join('\n\n');
  return `${content.study[0].markdown}\n${content.study[1].markdown}\n${content.practice.markdown}\n## 5. Evalúa lo aprendido\n\n${questions}\n\n${content.study[2].markdown}`;
}
