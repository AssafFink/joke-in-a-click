// Development-only sample texts for checking long / LTR content in the joke card.
// Only called behind import.meta.env.DEV; nothing runs at module load, so the
// whole module is dropped from production builds.
export function getDevSample(key: string | null): string | null {
  const longWord = 'Supercalifragilisticexpialidocious'.repeat(4);
  if (key === 'he') {
    return (
      'טקסט בדיקה ארוך (לא בדיחה): ' +
      'זהו טקסט ארוך שנועד לבדוק שהכרטיס גדל לגובה ולא לרוחב. '.repeat(8) +
      '\n\nשורה חדשה עם מילה ארוכה מאוד: ' +
      longWord
    );
  }
  if (key === 'en') {
    return (
      'Sample text (not a joke): ' +
      'This is a long English paragraph used to check left-to-right layout inside the card. '.repeat(8) +
      '\n\nA new line with a very long word: ' +
      longWord
    );
  }
  return null;
}
