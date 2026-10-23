// Authoring helpers only; none of these records are imported by the web app.
export const q = (prompt, correct, ...distractors) => ({ prompt, options: [correct, ...distractors] });
export const l = (objective, theory, example, reasoning, task, expected, questions) => ({ objective, theory, example, reasoning, task, expected, questions });
