# תוכנית — Milestone 3: Offline והפעלת PWA

**מקורות:** `MILESTONES.md` (Milestone 3), `PRD.md` (FR-04, FR-05, 3ב זרימת Offline, 4ב), `ARCHITECTURE.md` (2.3, 2.6, 2.7, 2.8, 3.1, ADR-2, ADR-4, ADR-5), `DESIGN.md` (1.3, 1.4, 1.5).
**נקודת פתיחה (הקוד הקיים):** יצירת בדיחה מקצה לקצה עובדת (Milestone 2). `src/strings.ts` כבר מכיל את הודעת ה-Offline (`offline`). ב-`src/App.tsx` הטיפוס `Status` עדיין ללא `'offline'`, וכל כשל מציג את הודעת השגיאה הכללית. אין `vite-plugin-pwa`, אין Manifest, אין Service Worker ואין תיקיית `public/`. תשובות `/api/joke` כבר מסומנות `Cache-Control: no-store` (`server/jokeApi.ts`). הכותרת משתמשת ב-`src/assets/kitten-placeholder.svg` (‏`kitten.png` עדיין לא סופק).

## 0. דרישות מקדימות

1. **`spec/assets/app-icon.png` — חסר כרגע.** אייקון ריבועי, 512×512 לפחות, עיצוב פשוט שנשאר ברור בגודל קטן (DESIGN 1.5), עם רישיון שימוש. **הבנייה לא מתחילה בלעדיו** (Development Execution Rule 5). כדאי שהעיצוב החשוב יהיה במרכז האייקון (כ-80% הפנימיים), כי Android חותך אייקונים מסוג Maskable לעיגול או לצורה אחרת.
2. **Preview לבדיקה בטלפון:** Claude יריץ `vercel deploy --target preview` **רק אחרי אישור בעל המוצר** (ADR-2, ADR-5), ויוודא שה-target של הפריסה הוא preview. בעל המוצר מתחבר בטלפון לחשבון Vercel כדי לפתוח את הכתובת.
3. **טלפונים:** Android עם Chrome, ו-iPhone עם Chrome — בעל המוצר מבצע את הבדיקות בהם בהדרכה צעד אחר צעד.

## 1. מבנה וגישה

```text
public/                    ← חדש: האייקונים שהופקו (נכנסים ל-Build כמו שהם)
vite.config.ts             ← הוספת VitePWA: Manifest, Service Worker, רשימת קבצים לשמירה מראש
index.html                 ← קישורי favicon ו-apple-touch-icon
src/api.ts                 ← הבחנה בין כשל רשת (fetch נכשל) לבין תשובת שגיאה מהשרת
src/App.tsx                ← מצב 'offline' והודעת ה-Offline
package.json               ← vite-plugin-pwa + מחולל האייקונים
```

**עיקרון:** ה-Service Worker שומר מראש (Precache) רק את קובצי "המעטפת" — HTML, JS, CSS, גופנים, תמונת החתלתול ואייקונים — כדי שהמסך ייפתח גם בלי אינטרנט. בקשות ל-`/api/joke` לעולם לא נשמרות: הן בקשות `POST` (ש-Workbox ממילא אינו שומר), ואין שום כלל Runtime Caching. אין שימוש ב-`localStorage`, `IndexedDB` או Cookies.

## 2. אייקונים — הפקה חד-פעמית מ-`app-icon.png`

- הוספת `@vite-pwa/assets-generator` כ-devDependency (המחולל הרשמי של vite-plugin-pwa).
- העתקת `spec/assets/app-icon.png` ל-`public/app-icon.png` (תיקיית `spec/` מוחרגת מהפריסה ב-`.vercelignore`, ולכן המקור לא יכול להיות שם).
- סקריפט `"icons": "pwa-assets-generator --preset minimal-2023 public/app-icon.png"`, מורץ פעם אחת (ושוב רק אם האייקון מתחלף). הקבצים שנוצרים נשמרים ב-`public/` ונכנסים ל-Repository:
  - `pwa-64x64.png`, `pwa-192x192.png`, `pwa-512x512.png`
  - `maskable-icon-512x512.png` (עם שוליים, על רקע Blush Pink `#F7AEB8` — הגדרה בקובץ `pwa-assets.config.ts` אם ברירת המחדל הלבנה לא מתאימה)
  - `apple-touch-icon-180x180.png` (ל-iPhone)
  - `favicon.ico`
- בדיקה חזותית של האייקונים שנוצרו (בעיקר ה-Maskable — שהעיצוב לא נחתך).

## 3. `vite.config.ts` — הגדרת `VitePWA`

```ts
VitePWA({
  registerType: 'autoUpdate',
  injectRegister: 'script',
  includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png'],
  manifest: {
    name: 'בדיחה בלחיצה',
    short_name: 'בדיחה בלחיצה',
    lang: 'he',
    dir: 'rtl',
    display: 'standalone',
    start_url: '/',
    scope: '/',
    theme_color: '#F7AEB8',
    background_color: '#FFF4ED',
    icons: [
      { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
      { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{html,js,css,svg,png,ico,woff2}'],
    navigateFallback: '/index.html',
    navigateFallbackDenylist: [/^\/api\//],
    cleanupOutdatedCaches: true,
  },
})
```

- **גופנים:** חבילות `@fontsource` מייצרות קבצי `woff2` (וגם `woff` ישנים). שומרים מראש רק `woff2` — Chrome משתמש בהם — כדי לא להכפיל את גודל ההורדה. המשקלים כבר מצומצמים ל-Heebo 400/700/900 ו-Assistant 400 (`src/main.tsx`). אם בבדיקה מתגלה שקובץ נחוץ חסר ברשימה — מוסיפים אותו.
- **תמונת החתלתול:** נכנסת אוטומטית (היא חלק מה-Build). כיום זו `kitten-placeholder.svg`; כש-`kitten.png` יסופק, גם הוא ייכלל בלי שינוי בהגדרה.
- **`navigateFallbackDenylist`** מבטיח שכתובות `/api/*` לעולם לא יקבלו את ה-HTML השמור.
- **אין `runtimeCaching`** — שום בקשה שאינה בקובצי המעטפת לא נשמרת.
- **עדכון גרסה (ARCHITECTURE 2.7):** `autoUpdate` עם `injectRegister: 'script'` — גרסה חדשה של ה-Service Worker מחליפה את הישנה ברקע, **בלי לרענן את הדף**. מסך פתוח ממשיך לעבוד עם הקבצים שכבר נטענו (גם בקשת בדיחה פעילה לא נקטעת, כי `/api` לא עובר דרך ה-Cache), והגרסה החדשה מוצגת בפתיחה הבאה. אין צורך בהודעת "גרסה חדשה" (שהייתה דורשת טקסט חדש בממשק). תיעוד כ-ADR-7.

## 4. `index.html`

- הוספת `<link rel="icon" href="/favicon.ico" sizes="48x48">` ו-`<link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png">`.
- `theme-color` כבר קיים (`#F7AEB8`). הקישור ל-Manifest מוזרק אוטומטית על ידי הפלגין בזמן ה-Build.

## 5. Frontend — מצב Offline

### 5.1 `src/api.ts`
- עטיפת ה-`fetch` עצמו ב-`try/catch`: אם `fetch` נכשל (אין תשובה מהשרת בכלל) — לזרוק `NetworkError` (מחלקה קטנה שמיוצאת מהקובץ). תשובת שגיאה מהשרת או תשובה לא תקינה — נשארות שגיאה רגילה, כמו היום.

### 5.2 `src/App.tsx`
- `type Status = 'idle' | 'loading' | 'success' | 'error' | 'offline'` (ARCHITECTURE 2.3).
- בתחילת `handleClick`: אם `navigator.onLine === false` — `setStatus('offline')` ויציאה. **לא נשלחת בקשה**, הכרטיס לא עובר לטעינה והתוכן שבו נשאר.
- ב-`catch`: אם השגיאה היא `NetworkError` **וגם** `navigator.onLine === false` → `'offline'`; כל מקרה אחר → `'error'` (ARCHITECTURE 2.6 סעיף 8). כך כשל רשת כשיש חיבור (למשל שרת שלא עונה) מציג את ההודעה הכללית.
- אזור ההודעה מתחת לכפתור: `error` → `strings.error`, `offline` → `strings.offline`, אחרת ריק. ההודעה נעלמת בלחיצה הבאה (כבר קורה — כל לחיצה מחליפה את ה-status).
- הכפתור נשאר פעיל במצב Offline (DESIGN 1.4). אין טקסט חדש, מודאל או Toast.

## 6. הרצה ובדיקה בזמן הבנייה (Claude)

ה-Service Worker לא פועל במצב פיתוח (`npm run dev` / `vercel dev`), ולכן הבדיקה המקומית נעשית על ה-Build:

1. `npm run build` — ללא שגיאות TypeScript; בפלט מופיעים `sw.js`, `manifest.webmanifest` ורשימת הקבצים שנשמרו מראש (לבדוק שהגופנים, החתלתול והאייקונים בפנים, ושאין שם `/api`).
2. `npm test` — הבדיקות הקיימות ממשיכות לעבור.
3. `npx vite preview` (‏localhost נחשב מאובטח, כך שה-Service Worker נרשם), ובדיפדפן המובנה:
   - ה-Manifest נטען ותקין (שם, RTL, אייקונים), ה-Service Worker פעיל.
   - **פתיחה בלי שרת:** עצירת שרת ה-preview ורענון — המסך נפתח מה-Cache עם הגופנים ותמונת החתלתול.
   - **כשל רשת כשיש "חיבור":** עם שרת עצור (הדפדפן עדיין מדווח שיש חיבור) לחיצה על "צור בדיחה" מציגה את הודעת השגיאה הכללית, לא את הודעת ה-Offline.
   - **מצב Offline:** הדמיה של `navigator.onLine = false` (בכלי הבדיקה, ללא שינוי בקוד) → לחיצה מציגה "נדרש חיבור לאינטרנט כדי ליצור בדיחה", ובבדיקת הרשת לא יצאה בקשה ל-`/api/joke`; הבדיחה הקודמת/המצב הריק נשארים בכרטיס.
   - בדיקת ה-Cache Storage: אין בו רשומות של `/api/joke`; אין נתונים ב-`localStorage`.
4. `vercel dev` — יצירת בדיחה אמיתית עדיין עובדת (בדיקת רגרסיה).
5. סגירת כל ההרצות בסיום.

**בדיקה בטלפונים (בעל המוצר, על Preview, אחרי אישור ל-`vercel deploy --target preview`):**
- **Android / Chrome:** התקנה ("הוספה למסך הבית" / "התקנת אפליקציה"), פתיחה מהאייקון במסך מלא, יצירת בדיחה, מצב טיסה ← פתיחה מחדש ← המסך מופיע תקין ← לחיצה מציגה את הודעת ה-Offline; גלילה בבדיחה ארוכה ופריסה ללא גלילה אופקית.
- **iPhone / Chrome:** ניסיון הוספה למסך הבית דרך תפריט השיתוף (אם הגרסה תומכת), אותן בדיקות Offline ופריסה. מה שלא נתמך ב-iOS מתועד כמגבלה, בלי להבטיח זהות ל-Android (ARCHITECTURE 1, סיכון 3).

## 7. עדכוני מסמכים בסוף הבנייה

- `ARCHITECTURE.md`: **ADR-7** — אסטרטגיית ה-Service Worker (Precache של המעטפת בלבד, ללא Runtime Caching, `autoUpdate` בלי רענון כפוי, `woff2` בלבד), והפקת האייקונים החד-פעמית ל-`public/`. כולל מגבלות iPhone שנמצאו בבדיקה.
- `MILESTONES.md`: 🟡 ליד כותרת Milestone 3.
- `CLAUDE.md` (פקודות הרצה): הוספת שורה — בדיקת PWA/Offline מקומית: `npm run build` ואז `npx vite preview`.
- `DESIGN.md` 1.5: עדכון הסטטוס של `app-icon.png` ומקור הרישיון — **רק באישור בעל המוצר** (שינוי ב-DESIGN).

## 8. מחוץ לתחום של Milestone זה

- כותרות אבטחה (`nosniff`, `Referrer-Policy`, CSP) — Milestone 4. **הערה:** הן עדיין לא מוגדרות בשום מקום בפרויקט, ו-Milestone 4 מתאר רק את *בדיקתן*; צריך להחליט אם להוסיף אותן ב-Milestone 4.
- החלפת תמונת החתלתול הזמנית ב-`kitten.png` — ממתין לקובץ (לא חלק מ-Milestone זה).
- כפתור "התקן אפליקציה" בתוך המסך, הודעת "גרסה חדשה זמינה", או כל טקסט שאינו בטבלה ב-DESIGN 1.3.
- שמירת בדיחות, נושאים או תשובות API — בשום צורה.

## 9. מיפוי ל-Definition of Done

| תנאי | איך מושג / נבדק |
|---|---|
| פתיחה ללא חיבור עם הגופנים והחתלתול; ניסיון יצירה מציג הודעת Offline ולא שולח בקשה | Precache (סעיף 3) + בדיקה מקומית ובטלפון (סעיף 6); בדיקה מוקדמת של `navigator.onLine` (סעיף 5.2) |
| כשל רשת כשיש חיבור מציג את השגיאה הכללית | `NetworkError` + בדיקת `navigator.onLine` (סעיף 5); בדיקה עם שרת עצור (סעיף 6) |
| הותקנה בפועל ב-Android, נבדקה התקנה ב-iPhone במגבלות המתועדות | Manifest + אייקונים (סעיפים 2–4); בדיקות בעל המוצר על Preview; תיעוד ב-ADR-7 |
| בדיחות ונושא לא נשמרים בין הפעלות; `/api/joke` לא נשמר במטמון | אין אחסון מתמשך; אין Runtime Caching; `navigateFallbackDenylist`; `no-store` קיים; בדיקת Cache Storage |
| כל המצבים באותו מסך, ללא מודאלים/תפריטים/דפים | הודעת ה-Offline באזור ההודעה הקיים; אין רכיבים חדשים |
