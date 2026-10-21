// All UI copy, as defined in DESIGN.md section 1.3.
export const strings = {
  title: 'בדיחה בלחיצה',
  topicLabel: 'נושא הבדיחה',
  topicPlaceholder: 'לדוגמה: חתולים, עבודה, טכנולוגיה...',
  button: 'צור בדיחה',
  jokeHeading: 'הבדיחה שלך',
  cardEmpty: 'הבדיחה תופיע כאן אחרי הלחיצה',
  cardLoading: 'מכין לך בדיחה...',
  error: 'לא הצלחנו ליצור בדיחה כרגע. אפשר לנסות שוב.',
  offline: 'נדרש חיבור לאינטרנט כדי ליצור בדיחה',
} as const;

export const TOPIC_MAX_LENGTH = 100;
