# תוכנית — Milestone 1: הקמת פרויקט, מסך ראשי וחיבור ל-Vercel

**מקורות:** `MILESTONES.md` (Milestone 1), `PRD.md`, `DESIGN.md` (+ `wireframes.png`, `mockups.png`, `style-guide.png`), `ARCHITECTURE.md` (סעיפים 1, 2.6 נגישות, 3.1–3.2, ADR-1, ADR-2, ADR-4).

**מטרה:** מסך יחיד מעוצב שרץ מקומית ובכתובת Preview ב-Vercel. אפשר להקליד נושא, אבל עדיין אי אפשר ליצור בדיחה — הכפתור מושבת.

---

## 0. דרישות מקדימות — חוסם לפני בנייה

| פריט | מצב | מה צריך |
|---|---|---|
| `spec/assets/kitten.png` | ❌ חסר (התיקייה `spec/assets/` לא קיימת) | בעל המוצר מספק צילום חתלתול, רצוי רקע שקוף, רוחב ≥600px, עם רישיון שימוש. אחרי שסופק — לעדכן סטטוס ומקור רישיון בטבלה ב-DESIGN 1.5. |
| חשבון Vercel | טרם נפתח | בעל המוצר פותח (שלב 7). |
| Repository ב-GitHub | טרם נוצר / טרם חובר | בעל המוצר יוצר repo ריק ונותן את הכתובת (נדרש לחיבור Vercel ולדחיפה). |
| Vercel CLI | לא מותקן במחשב | יותקן כתלות פיתוח בפרויקט (שלב 1). |

לפי כלל 5 ב-MILESTONES: **הבנייה לא מתחילה עד ש-`kitten.png` מסופק.**

---

## 1. הקמת הפרויקט

**גישה:** פרויקט Vite + React + TypeScript מינימלי, שנכתב ידנית (בלי קבצי הדמו של התבנית), בשורש ה-repo.

קבצים ליצירה:

| קובץ | תוכן |
|---|---|
| `package.json` | שם `joke-in-a-click`, `"type": "module"`. Scripts: `dev` → `vite`, `build` → `tsc -b && vite build`, `preview` → `vite preview`. תלויות: `react`, `react-dom`, `@fontsource/heebo`, `@fontsource/assistant`. תלויות פיתוח: `vite`, `@vitejs/plugin-react`, `typescript`, `@types/react`, `@types/react-dom`, `vercel`. |
| `tsconfig.json` + `tsconfig.app.json` + `tsconfig.node.json` | הגדרות סטנדרטיות של תבנית Vite react-ts, `strict: true`. |
| `vite.config.ts` | `plugin-react` בלבד (ה-PWA נוסף ב-Milestone 3). |
| `index.html` | `<html lang="he" dir="rtl">`, `meta viewport` (`width=device-width, initial-scale=1, viewport-fit=cover`), `meta theme-color` = `#F7AEB8`, `<title>בדיחה בלחיצה</title>`, `<div id="root">`. |
| `src/main.tsx` | טעינת React, ייבוא הגופנים והעיצוב. |
| `src/App.tsx` | המסך היחיד (פירוט בשלב 3). |
| `src/components/Header.tsx` | אזור הכותרת. |
| `src/components/TopicField.tsx` | תווית + שדה + מונה. |
| `src/components/JokeCard.tsx` | כותרת "הבדיחה שלך" + הכרטיס (בשלב זה: מצב ריק). |
| `src/components/Decorations.tsx` | איורי SVG פשוטים: לב, ניצוץ, סמיילי, טביעת כף, קווקווי "קרניים". |
| `src/strings.ts` | כל טקסטי הממשק מטבלת DESIGN 1.3 במקום אחד (כולל טקסטי טעינה/שגיאה/Offline, לשימוש ב-Milestones הבאים). |
| `src/styles.css` | משתני צבע, טיפוגרפיה ופריסה. |
| `src/assets/kitten.png` | עותק של `spec/assets/kitten.png` (מיובא דרך Vite). |
| `src/vite-env.d.ts` | הצהרות טיפוסים של Vite. |
| `.vercelignore` | `.env`, `.env.*`, `node_modules`, `spec` — כדי ש-`vercel deploy` לא יעלה סודות או קבצים מיותרים. |

- `.gitignore` — כבר מכסה `node_modules/`, `dist/`, `.vercel/`, `.env`. לא צריך שינוי.
- **אין `.env` / `.env.example` ב-Milestone הזה** — עדיין אין משתני סביבה. הם נוספים ב-Milestone 2.
- Vercel CLI מותקן כתלות פיתוח (`npx vercel ...`) ולא גלובלית — פחות שינויים במחשב, וגרסה קבועה לכל הפרויקט.

## 2. גופנים (ADR-4)

- ייבוא ב-`main.tsx` רק של המשקלים שבשימוש: `@fontsource/heebo/400.css`, `700.css`, `900.css`; `@fontsource/assistant/400.css`.
- `font-family: 'Heebo', 'Assistant', sans-serif` על ה-`body`.
- הקבצים נבנים לתוך `dist/` (לא נטענים מ-Google Fonts).

## 3. המסך — מבנה ותוכן

סדר מלמעלה למטה (Wireframe + DESIGN 1.1), בעמודה אחת, `max-width` ≈ 480px וממורכזת:

1. **Header** — רקע במעבר עדין Blush Pink → Pale Pink, קצה תחתון גלי (SVG). בתוכו:
   - `<h1>` "בדיחה בלחיצה" — Heebo 900, ‏36px, Charcoal, ממורכז, עם קווקווי "קרניים" ורודים בצדדים (קישוט).
   - תמונת החתלתול (`alt=""` כי היא קישוטית; רוחב מוגבל ≈ 200px).
   - לבבות קטנים פזורים (SVG, `aria-hidden`).
   - **ללא אייקון תפריט** (DESIGN 1.1, MILESTONES).
2. **TopicField**
   - `<label for="topic">` "נושא הבדיחה" — סגנון H2 ‏(24px Bold), מיושר לימין.
   - `<input id="topic" type="text" maxLength={100}>` — רקע לבן, מסגרת ורודה דקה, רדיוס ~20px, Placeholder "לדוגמה: חתולים, עבודה, טכנולוגיה..." בצבע Cocoa. טביעת כף קישוטית בצד השמאלי של השדה (`aria-hidden`, לא לחיצה).
   - מונה `{topic.length}/100` — Caption ‏14px, Cocoa, בצד השמאלי מתחת לשדה (כמו ב-Mockup), עטוף ב-`dir="ltr"` כדי שהמספרים יוצגו נכון. מקושר לשדה ב-`aria-describedby`.
3. **כפתור** `<button disabled>` "צור בדיחה" — רקע Raspberry ‏`#C93A6B`, טקסט לבן Bold ‏18px, צורת קפסולה, רוחב כמעט מלא, צל עדין, אייקון ניצוצות לבן לצד הטקסט, וקווקווים ורודים קישוטיים מחוץ לכפתור. מושבת: `opacity: 0.5`, `cursor: not-allowed`.
4. **אזור הודעות** מתחת לכפתור — `<p role="status" aria-live="polite">` ריק (ישמש לשגיאה/Offline בהמשך). שומר מקום קבוע כדי שהמסך לא "יקפוץ".
5. **JokeCard**
   - `<h2>` "הבדיחה שלך" — 24px Bold, מיושר לימין.
   - כרטיס Pale Pink, רדיוס ~24px, צל מפוזר. **מצב ריק:** סמיילי ורוד עם קרניים, לבבות קטנים, והטקסט "הבדיחה תופיע כאן אחרי הלחיצה" (Body, ממורכז).
   - אזור הטקסט של הבדיחה מוגדר כבר עכשיו: `dir="auto"`, `white-space: pre-wrap`, `overflow-wrap: anywhere`, ללא רוחב קבוע — כך שגם טקסט באנגלית (LTR) וגם טקסט ארוך או מילה ארוכה בלי רווחים לא יגרמו לגלילה אופקית. הטקסט מוצג כטקסט רגיל (לא HTML).

## 4. התנהגות שדה הנושא (FR-01)

- State יחיד ב-`App`: `topic: string`.
- `maxLength={100}` — הדפדפן חוסם תו 101 וחותך הדבקה ארוכה ל-100.
- הגנה נוספת ב-`onChange`: `value.slice(0, 100)` (אותה ספירה של JavaScript — `length`).
- המונה מתעדכן בכל שינוי. אין הודעת שגיאה על חריגה.

## 5. עיצוב (`styles.css`)

- משתני CSS בשורש: `--blush #F7AEB8`, `--pale #FBD6DC`, `--cream #FFF4ED`, `--charcoal #2E2424`, `--cocoa #8B5E4D`, `--white #FFFFFF`, `--raspberry #C93A6B`; רדיוסים 16–24px; צל מפוזר אחד משותף.
- `body`: רקע Cream, טקסט Charcoal, 16px Regular, `margin: 0`.
- מניעת גלילה אופקית: `box-sizing: border-box` לכולם, `overflow-x: hidden` על ה-`body`, `img { max-width: 100% }`, ריפוד צדדי ≈ 20px.
- ריווח אנכי נדיב בין החלקים. אין מעברי צבע מתחת לטקסט מלבד רקע ה-Header (מותר לפי DESIGN 2.1).
- מצב `:focus-visible` ברור לשדה ולכפתור (טבעת Raspberry).

## 6. בדיקת טקסט ארוך בזמן פיתוח

כדי לעמוד בתנאי "ניתן לבדוק טקסט ארוך בשלב הפיתוח" **בלי** להציג בדיחה מזויפת למשתמשים:

- רק כש-`import.meta.env.DEV` (שרת פיתוח מקומי), פרמטר בכתובת `?sample=he` או `?sample=en` ממלא את הכרטיס בטקסט בדיקה ארוך (עברית / אנגלית, כולל מילה ארוכה מאוד בלי רווחים). הטקסט עצמו מתחיל ב-"טקסט בדיקה" / "Sample text" כדי שלא ייראה כמו בדיחה.
- ב-Build של Production הקוד הזה מוסר אוטומטית ואינו קיים — כך זה גם ב-Preview ב-Vercel.

## 7. Vercel — הדרכת בעל המוצר (ADR-1, ADR-2)

אחרי שהמסך עובד מקומית, הדרכה צעד אחר צעד בשפה פשוטה:

1. **פתיחת חשבון Vercel** (תוכנית Hobby) ב-vercel.com — מומלץ "Continue with GitHub".
2. **יצירת Repository ריק ב-GitHub** (בלי README/‏.gitignore) — בעל המוצר נותן לי את הכתובת. (הדחיפה עצמה תתבצע רק בסיום, באישור.)
3. **התחברות ל-CLI:** בעל המוצר מריץ בעצמו `npx vercel login` (נדרשת התחברות בדפדפן — זה החשבון שלו).
4. **קישור הפרויקט:** `npx vercel link` — יוצר פרויקט ב-Vercel ותיקיית `.vercel/` (מוחרגת ב-git). לוודא ש-Framework זוהה כ-**Vite**, Build ‏`npm run build`, Output ‏`dist`.
5. **חיבור ה-Repository:** ב-Vercel Dashboard ← Project ← Settings ← Git ← Connect, ובחירת ה-repo. אם Vercel לא מאפשר לחבר repo ריק — נחבר מיד אחרי הדחיפה הראשונה (שאז גם תפרסם ל-Production, כמתוכנן ב-ADR-1).
6. **Preview:** אחרי **אישור מפורש** של בעל המוצר — `npx vercel deploy` (בלי `--prod`). מתקבלת כתובת HTTPS זמנית. בעל המוצר פותח אותה ב-Chrome בטלפון ומתחבר לחשבון Vercel שלו (Preview מוגן).

אין push ואין `--prod` במסגרת הבנייה.

## 8. `CLAUDE.md` — פקודות הרצה

למלא את הסעיף:
- **הרצה (dev):** `npm run dev` (שרת Vite מקומי). ב-Milestone 2, כשיתווסף ה-API, יעודכן ל-`npx vercel dev`.
- **בדיקות (test):** אין (Vitest נוסף ב-Milestone 2).

## 9. בדיקות שאבצע בעצמי לפני סימון 🟡

| בדיקה | איך |
|---|---|
| התקנה ו-Build | `npm install`, `npm run build` — ללא שגיאות TypeScript. |
| המסך נטען | `npm run dev` ופתיחה בדפדפן המובנה בגודל מובייל (375×812). |
| מבנה ותוכן | השוואה ל-Wireframe/Mockup; כל טקסט מול טבלת DESIGN 1.3; אין תפריט. |
| RTL | `dir="rtl"` על המסמך, יישור לימין של התוויות. |
| 100 תווים | הזנת 100 תווים → מתקבל; תו 101 → לא נוסף; המונה מציג `100/100`. |
| הדבקה ארוכה | הדבקת 150 תווים → נחתך ל-100. |
| גלילה אופקית | `document.documentElement.scrollWidth <= innerWidth` במצב רגיל וגם עם `?sample=he` ו-`?sample=en`. |
| כפתור מושבת | מושבת, בשקיפות 50%, לחיצה לא עושה דבר. |
| אין סודות | חיפוש ב-`dist/` וב-repo אחר `sk-`, `OPENAI`, `API_KEY` — אין תוצאות. |
| `?sample` לא ב-Production | חיפוש טקסט הבדיקה ב-`dist/` — לא נמצא. |
| Vercel | `npx vercel link` הצליח; כתובת Preview נוצרה (באישור) ונבדקה על ידי בעל המוצר בטלפון. |

בסיום: סגירת שרת הפיתוח, סימון 🟡 ליד כותרת Milestone 1 ב-`MILESTONES.md`, בלי commit.

## 10. מחוץ לטווח של Milestone זה

- `/api/joke`, OpenAI, `.env`, מצבי טעינה/שגיאה אמיתיים, Vitest — Milestone 2.
- PWA, Manifest, Service Worker, אייקונים, Offline — Milestone 3.
- כותרות אבטחה (CSP וכו') — Milestone 4.

## Definition of Done (מתוך MILESTONES)

- [ ] הפרויקט מותקן, נבנה ללא שגיאות TypeScript ונטען מקומית.
- [ ] כל הרכיבים המרכזיים במסך יחיד, דומה למקורות העיצוב, ללא תפריט; הטקסטים תואמים ל-DESIGN 1.3.
- [ ] עברית ו-RTL; 100 תווים מתקבלים, תו 101 לא, הדבקה ארוכה נחתכת ל-100.
- [ ] אין גלילה אופקית במובייל; ניתן לבדוק טקסט ארוך בפיתוח.
- [ ] הפרויקט מקושר ל-Vercel, וכתובת ה-Preview נפתחת בטלפון ומציגה את המסך.
- [ ] אין מפתחות API או סודות בקוד הלקוח או ב-Repository.
