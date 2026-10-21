# ARCHITECTURE — בדיחה בלחיצה

**תאריך מחקר:** 21 באוקטובר 2026  
**מסמך מקור:** `PRD.md`  
**סטטוס:** ארכיטקטורה נבחרת למימוש

## 1. Technology Stack שנבחר

| רכיב | טכנולוגיה | תפקיד |
|---|---|---|
| Frontend | React + TypeScript | מסך יחיד, ניהול מצב טעינה/שגיאה והצגת בדיחות |
| Build / Dev | Vite | כלי פיתוח ובניית Frontend סטטי |
| Styling | CSS רגיל | עיצוב צבעוני, קליל, רספונסיבי ו-RTL ללא ספריית UI כבדה |
| Fonts | `@fontsource/heebo`, `@fontsource/assistant` | קובצי הגופנים נכללים בפרויקט עצמו (לא נטענים מ-Google Fonts), נכנסים ל-Precache ומוצגים נכון גם Offline |
| PWA | `vite-plugin-pwa` (מבוסס Workbox) | Web App Manifest, Service Worker ומטמון Offline לקובצי הממשק |
| Backend | TypeScript ב-Node.js, באמצעות Vercel Function | Endpoint מוגן ליצירת בדיחה וקריאה ל-OpenAI; ללא שרת Express קבוע |
| AI | OpenAI SDK הרשמי ל-Node.js, Responses API, מודל `gpt-5` | יצירת טקסט הבדיחה |
| Hosting | Vercel | אירוח אתר סטטי ו-Serverless Function באותו Domain, HTTPS ו-Deployment |
| Source Control | Git + GitHub | Repository יחיד ותיעוד שינויים |
| סודות | Vercel Environment Variables / `.env` מקומי (עם `.env.example` ללא ערכים) | מפתח API ב-Backend בלבד |
| בדיקות אוטומטיות | Vitest | מספר קטן של בדיקות לאימות הקלט ב-`/api/joke`; ללא בדיקות UI אוטומטיות |
| Database / Authentication | לא נדרשים | אין נתונים לשימור ואין חשבונות משתמשים |

### נימוקים לבחירה

- **React + Vite:** שילוב מוכר, מתועד ונוח לכלי AI. נבחנו גם Vue ו-Next.js; לפרויקט של מסך יחיד ללא SEO דינמי, ניהול משתמשים או Server-Side Rendering, React עם Vite פשוט יותר מ-Next.js, ונהנה מאקוסיסטם רחב. TypeScript מאפשר לשתף טיפוסים בין צד לקוח וצד שרת.
- **Vercel Function במקום Express Server:** נבחנה חלופה של Express בשרת מתמשך, וגם Functions במסגרת Next.js. Endpoint יחיד קל למימוש כ-Function ללא תחזוקת שרת או Framework נוסף. Vercel תומך ישירות בפרויקט Vite ובתיקיית `api/`.
- **Vercel במקום פיצול GitHub Pages + Backend חיצוני:** GitHub Pages מתאים ל-Frontend סטטי בלבד, אך כאן נדרש Backend ששומר סוד. פריסה מאוחדת ב-Vercel מקטינה מורכבות, מאפשרת Endpoint מאותו Origin ומבצעת פריסות אוטומטיות מ-GitHub. נבחנה גם חלופת Cloudflare Pages/Workers; Vercel נבחר בזכות נתיב הפריסה הישיר המועדף ובשל תמיכת Node.js.
- **PWA באמצעות vite-plugin-pwa:** נבחנו Service Worker ידני והפלגין; הפלגין מפחית תחזוקת Manifest ומדיניות caching. אין צורך בתוספות Offline לשמירת בדיחות.
- **OpenAI Responses API:** ממשק רשמי ליצירת טקסט ב-GPT-5; אין צורך ב-Agent, ב-RAG או בשירותי AI נוספים.
- **ללא Database, Redis, Supabase, Blob Storage, Authentication או ORM:** אין דרישה לשמירת משתמשים, בדיחות או קבצים.

### סיכונים ומגבלות חשובים

1. **מודל `gpt-5` מסומן Deprecated** בתיעוד הרשמי נכון למועד המחקר. הוא נשאר הבחירה המחייבת לפי ה-PRD; אין מעבר אוטומטי ל-GPT-5 Mini, GPT-6 או למודל אחר. אם המודל אינו זמין לחשבון או מוסר מה-API, יש להציג כשל ולהעלות החלטת מוצר חדשה. **בעל המוצר אישר ביודעין את השימוש ב-`gpt-5` למרות הסימון.** הגישה בפועל למודל נבדקת כבר ב-Milestone 2, ולא רק לפני הפריסה.
2. **אין הגבלת מספר בדיחות או Rate Limiting של המוצר.** כל בקשה מוצלחת מחייבת תשלום לפי Tokens, וכל אדם שמגיע לכתובת ה-Endpoint (גם באמצעות סקריפט) יכול לצרוך תקציב. ההגנה היא תפעולית בלבד ואינה מגבילה משתמשים: (א) **תקרת הוצאה חודשית קשיחה** בפרויקט OpenAI שמשמש את האפליקציה, ובנוסף התראות תקציב; (ב) **תקרה טכנית לאורך התשובה** (`max_output_tokens`, ראו 2.5). כשהתקרה החודשית מושגת, הבקשות נכשלות עם הודעת השגיאה הרגילה. אם מתגלה שימוש לרעה, אין להוסיף חסימת קצב עסקית ללא שינוי ב-PRD.
3. **התאמת iPhone/Chrome ל-PWA:** ב-iOS התקנה למסך הבית דרך Chrome תלויה ביכולות הדפדפן וגרסת iOS; תפריט שיתוף ו-Add to Home Screen עשויים להחליף את חלונית ההתקנה שקיימת ב-Android. נדרשת בדיקה במכשיר אמיתי. אין להבטיח חוויית התקנה זהה בשני המכשירים.
4. **Vercel Functions:** קיימים Timeout, תקרות שימוש ותנאי תוכנית. במקרה של עיכוב ארוך של OpenAI תוחזר שגיאה. Vercel Hobby מיועד לשימוש אישי לא מסחרי בלבד; שימוש מסחרי מחייב בחינה של תוכנית מתאימה.
5. **איכות הבדיחה ושפה:** זיהוי שפת הנושא והיענות המודל הן הסתברותיות. המשתמש יכול להזין טקסט בשפות מעורבות; ה-Prompt יורה למודל לפעול לפי כללי השפה שב-PRD (FR-02): נושא עם אותיות עבריות או שם/מונח לועזי בודד — עברית; משפט או ביטוי שלם בשפה אחרת — אותה שפה.

## 2. ארכיטקטורת המערכת

### 2.1 מבנה כללי

```text
Android / iPhone Chrome (או PWA מותקנת)
      |
      | HTTPS: Static Assets + POST /api/joke
      v
Vercel (אותו Origin)
      |                         
      +-- Static React/Vite app  
      |    +-- מסך יחיד RTL
      |    +-- Service Worker + Cache למעטפת Offline
      |    +-- State זמני בזיכרון
      |
      +-- Node.js Serverless Function: /api/joke
               +-- אימות קלט / טיפול שגיאות
               +-- System instructions
               +-- OpenAI SDK (Secret בשרת)
                         |
                         v
                    OpenAI Responses API
                      model: gpt-5
```

ה-Frontend אינו שולח בקשות ישירות ל-OpenAI. רק ה-Backend מכיר את ה-API Key. כל רכיבי המערכת באותו Vercel Project ובאותו Origin. אין שרת מתמשך ואין בסיס נתונים.

### 2.2 חלוקה ל-Modules ולשכבות

| שכבה / Module | אחריות |
|---|---|
| Presentation | כותרת "בדיחה בלחיצה", קלט נושא עד 100 תווים, לחצן יצירה, אזור בדיחה, חיווי טעינה ושגיאה; פריסה למובייל ו-RTL |
| Client State | נושא נוכחי, בדיחה אחרונה, `idle/loading/success/error/offline` ונעילת לחצן בעת קריאה |
| Client API | `fetch('/api/joke')`, בדיקת תשובות, שגיאות תקשורת; ללא מפתח OpenAI |
| PWA Runtime | Manifest, Service Worker, מטמון לקובצי האפליקציה ועמוד הראשי לפתיחה Offline |
| API Boundary | `POST /api/joke`, בדיקת Method, JSON וגודל הקלט, תשובה בפורמט אחיד |
| Joke Generation | System Prompt מוגדר בשרת, בניית בקשה, שליחת בקשה חדשה ועצמאית ל-GPT-5 וחילוץ הבדיחה |
| Configuration | טעינת מפתח OpenAI בשרת בלבד וטיפול במקרה שהוא חסר |

אין הצדקה להוספת שכבת Repository, CQRS, Queue, Event Bus או Microservices.

### 2.3 Data Model ושמירת נתונים

אין אחסון מתמשך של מידע עסקי. כל נתוני המשתמש קיימים בזיכרון Frontend כל עוד המסך פתוח:

- `topic: string` — נושא נוכחי (0–100 תווים; `""` = בדיחה כללית).
- `joke: string | null` — הבדיחה המוצגת האחרונה בלבד.
- `status: 'idle' | 'loading' | 'success' | 'error' | 'offline'` — מצב הממשק.
- `errorMessage: string | null` — הודעה בעברית, אם יש.

אין `localStorage` לבדיקות היסטוריה או להתמדה של בדיחות, ואין Cookies ל-Session. Cache של Service Worker מיועד **לקובצי המעטפת בלבד**, לא לתגובות AI, נושאים או בדיחות. רענון רגיל יכול לאפס את הנושא והבדיחה; לא נדרשת המשכיות בין ביקורים.

### 2.4 API ציבורי של האפליקציה

**Endpoint:** `POST /api/joke`  
**Content-Type:** `application/json`  
**Body:**

```json
{ "topic": "חתולים" }
```

`topic` הוא string אופציונלי (אפשר גם מחרוזת ריקה או שדה חסר). השרת יבצע `trim`; רווחים בלבד שקולים לנושא ריק. התוכן חייב להיות באורך עד 100 תווים לאחר ניקוי רווחי קצה, כשהאורך נמדד ב-`topic.length` — אותה שיטה שבה משתמש שדה הקלט (`maxLength`) בממשק. השרת יאמת גם ללא הסתמכות על הגבלת ה-UI. אין להרחיב אורך קלט דרך API ישיר.

**הצלחה — `200`:**

```json
{ "joke": "למה החתול התיישב ליד המחשב? כי הוא רצה לתפוס את העכבר!" }
```

**כשל קלט — `400`:**

```json
{ "error": "INVALID_TOPIC", "message": "יש להזין נושא באורך של עד 100 תווים" }
```

**כשל יצירה — `502` (או `503` לשירות שאינו זמין):**

```json
{ "error": "GENERATION_FAILED", "message": "לא הצלחנו ליצור בדיחה כרגע. אפשר לנסות שוב." }
```

**חריגה מזמן ההמתנה ל-OpenAI — `504`:** `{ "error": "GENERATION_TIMEOUT", "message": "לא הצלחנו ליצור בדיחה כרגע. אפשר לנסות שוב." }` (אותה הודעה למשתמש כמו בכשל יצירה).

- בקשה בשיטה שאינה `POST`: `405` עם `{ "error": "METHOD_NOT_ALLOWED", ... }`.
- JSON לא תקין, טיפוס לא נכון או קלט גדול מדי: `400` (`INVALID_REQUEST`) / `413` (`PAYLOAD_TOO_LARGE`) בהתאמה; הגדרת גבול גודל גוף בקשה קטן התואם 100 תווים, בנוסף לאימות שדה.
- קודי `405`/`413`/`400` רלוונטיים רק לפניות ישירות ל-API; הממשק אינו אמור לייצר אותם. אם בכל זאת מתקבל אחד מהם, הממשק מציג את הודעת השגיאה הכללית מטבלת הטקסטים ב-DESIGN.
- כל שדה `message` בתשובות השרת הוא בעברית. הממשק מציג את הנוסחים מטבלת הטקסטים ב-DESIGN ואינו תלוי בטקסט שמגיע מהשרת.
- `Cache-Control: no-store` לתשובות `/api/joke`, כולל הצלחות וכשלים.
- אין Retry אוטומטי בשרת, כדי להימנע מחיובי AI כפולים; ניסיון חוזר מתבצע ביוזמת המשתמש.
- אין צורך ב-CORS פתוח: ה-Frontend פונה ל-API מאותו Origin. ניתן לדחות `Origin` חיצוני כאשר הכותרת קיימת, אך אין לראות בכך Authentication או הגנה מפני שימוש בתוכנות חיצוניות.
- בהיעדר Authentication ה-Endpoint פומבי. אין להסתמך על הסתרת כתובת ה-Endpoint כעל אבטחה.

### 2.5 יצירת בדיחה ב-OpenAI

- להשתמש ב-OpenAI SDK הרשמי ב-Backend וב-`client.responses.create` עם `model: 'gpt-5'`, `store: false` ובקשת Text בלבד.
- **רמת חשיבה מינימלית:** `reasoning: { effort: 'minimal' }`. GPT-5 הוא מודל ש"חושב" לפני שהוא עונה; בברירת המחדל בדיחה קצרה עלולה להימשך עשרות שניות ולעלות גם על Tokens החשיבה. ברמה מינימלית התשובה צפויה להגיע תוך שניות ספורות. אם האיכות נמוכה מדי, אפשר לעלות ל-`'low'` — זו החלטה טכנית שמתועדת כ-ADR.
- **תקרה טכנית לאורך התשובה:** `max_output_tokens: 800`. התקרה כוללת גם את Tokens החשיבה, והיא גבוהה בהרבה מאורך בדיחה רגילה. מטרתה הגנה מפני עלויות חריגות בלבד (PRD FR-02). אם התשובה נקטעה בגלל התקרה (`status: 'incomplete'`), מחזירים את השגיאה האחידה.
- להשתמש ב-`instructions` קבועים ומבודדים מהקלט: לייצר בדיחה חדשה המתייחסת לנושא; כשאין נושא, בדיחה כללית בעברית; שפת הבדיחה לפי כללי השפה ב-PRD FR-02; מדיניות התוכן לפי PRD FR-07 (מתאים לכל המשפחה; בנושא לא מתאים — בדיחה כללית מתאימה במקום, ללא הודעת סירוב); להחזיר את טקסט הבדיחה בלבד, בלי הקדמות או הסברים; אין סגנון או אורך קבועים.
- להעביר את הנושא בתור **נתון משתמש** ולא כהוראות מערכת; להבהיר ל-AI שאין לבצע הוראות מוטמעות בנושא המשנות את תפקידו או דורשות לחשוף סודות.
- כל לחיצה מייצרת קריאה עצמאית ללא Conversation ID וללא צבירת היסטוריה. בקשה חוזרת עשויה להפיק בדיחה דומה, אך יש לבקש גיוון; לא ניתן להבטיח ייחוד מוחלט ללא היסטוריה.
- לבדוק ש-`output_text` הוא string שאינו ריק; אם חסר או אם ה-API מחזיר שגיאה, להחזיר שגיאה אחידה ללקוח.
- להגדיר Timeout ברמת הבקשה ל-OpenAI של 30 שניות, ומגבלת ביצוע ב-Vercel גבוהה ממנו (60 שניות, בכפוף לתוכנית). בחריגה — `504` עם הודעת השגיאה הכללית.
- לא לשמור נושא, בדיחה או תגובת מודל בלוגים. ניתן לרשום מטא-נתונים לא-רגישים (קוד שגיאה, משך פעולה) לצורך אבחון.

### 2.6 Data Flow ו-UX

1. המשתמש פותח את האתר או את ה-PWA; רכיבי ה-UI נטענים מהשרת או מ-Cache מקומי.
2. הנושא מוקלד (עד 100 תווים), או נשאר ריק.
3. לחיצה על לחצן יצירת הבדיחה: אם הדפדפן מדווח שאין חיבור (`navigator.onLine === false`), מוצג מיד מצב `offline` ולא נשלחת בקשה. אחרת, המצב משתנה ל-`loading`, מוצג **"מכין לך בדיחה..."** בתוך כרטיס הבדיחה (במקום תוכנו הקודם — ראו מצבי הכרטיס ב-DESIGN) והלחצן מושבת.
4. Frontend שולח בקשת `POST /api/joke` ללא API Key.
5. Backend מאמת קלט, מכין הוראות ופונה ל-OpenAI עם הסוד הסביבתי.
6. בהצלחה מתקבלת הבדיחה; Frontend מחליף את הבדיחה הקודמת, מסתיר את הודעת הטעינה ומאפשר לחיצה חדשה.
7. בכשל נשמרת היכולת לנסות שוב ומוצגת הודעת שגיאה בעברית. אין למחוק את הנושא שהמשתמש הזין. בדיחה קודמת, אם קיימת, חוזרת להיות מוצגת בכרטיס, והודעת השגיאה מוצגת מתחת לכפתור (ראו DESIGN).
8. בהיעדר אינטרנט האפליקציה עדיין נפתחת מתוך Cache; ניסיון לייצר מציג **"נדרש חיבור לאינטרנט כדי ליצור בדיחה"**, ללא ניסיון לייצר תשובה מזויפת Offline. אם הבקשה נכשלה בשגיאת רשת (ה-`fetch` עצמו נכשל) ו-`navigator.onLine` הוא `false` — מוצגת הודעת ה-Offline; אחרת — הודעת השגיאה הכללית.
9. אין Timeout נפרד בצד הלקוח מעבר לזה של השרת; הלחצן נשאר מושבת עד שמתקבלת תשובה או שגיאה.

**נגישות בסיסית:** תווית נושא מקושרת לשדה; כפתור ניתן לשימוש במגע ובמקלדת; `aria-live` מתון לחיווי טעינה/שגיאה ותוכן בדיחה; ניגודיות וטקסט קריא; שימוש ב-`dir="rtl"` לאתר והצגת בדיחה בהתאם לשפה שזוהתה, באמצעות `dir="auto"` על אזור הבדיחה. הטקסט מוצג כטקסט פשוט, לא כ-HTML שמיוצר על ידי AI.

### 2.7 PWA, תמיכה במכשירים ו-Offline

- Web App Manifest כולל `name` ו-`short_name`: **"בדיחה בלחיצה"**, `lang: "he"`, `dir: "rtl"`, `display: "standalone"`, `start_url: "/"`, `scope: "/"`, צבעי Theme ואייקוני PNG 192×192 ו-512×512 (לרבות Maskable במידת האפשר). האייקונים, וכן `apple-touch-icon` ל-iPhone, מופקים מקובץ המקור `spec/assets/app-icon.png` שמספק בעל המוצר (ראו DESIGN).
- Service Worker דרך `vite-plugin-pwa` יקבע Precache ל-HTML, JS, CSS, אייקונים, קובצי הגופנים, תמונת החתלתול ומשאבים מקומיים חיוניים. יש לתמוך בטעינת `/` במצב Offline גם לאחר התקנה/טעינה מקוונת ראשונה מוצלחת.
- **לא** לבצע caching ל-`/api/*` או לקריאות OpenAI; כל יצירת בדיחה מחייבת בקשה חיה.
- שימוש ב-HTTPS של Vercel; ב-Development, `localhost` נחשב Secure Context בהקשרים רלוונטיים.
- תהליך עדכון Service Worker יבטיח שקובצי המעטפת מתעדכנים בצורה תקינה; אין להחליף קבצים באמצע בקשה פעילה.
- הבדיקה הנדרשת היא Chrome ב-Android וב-iPhone, במכשירים וגרסאות iOS נתמכים. תמיכה ב-iPhone אינה מבטיחה Prompt התקנה אוטומטי: התקנה דרך תפריט Share / Add to Home Screen כאשר נתמכת.
- ללא דרישה להתאמה ל-Desktop או ל-Firefox/Safari כממשק גלישה נתמך, אף שמנגנוני iOS עשויים להשתמש בתשתית מערכת משותפת. אין חסימה או הודעת אזהרה בדפדפנים אחרים (PRD 5א).
- בדיקות PWA ו-Offline בטלפון אמיתי דורשות כתובת HTTPS, ולכן נעשות על Preview Deployment או על Production (ראו 3.1), לא על `localhost`.

### 2.8 Authentication, אבטחה ופרטיות

- אין מערכת Login, Cookies של Authentication או הרשאות משתמש.
- `OPENAI_API_KEY` הוא Server-only Environment Variable. אין להוסיף אותו ל-`VITE_*`, ל-HTML, ל-Repository, ל-Manifest או לתגובות API.
- בכל סביבת Vercel יש להגדיר Secret מתאים. המפתח המקומי נשמר בקובץ `.env` (שכבר מוחרג ב-`.gitignore`) ואינו עולה ל-GitHub; בקובץ `.env.example` מופיעים שמות המשתנים בלבד. **אין להשתמש ב-`vercel env pull`**, כי הוא מוריד סודות לקובץ מקומי נוסף.
- כל התקשורת של המשתמש מול Vercel וכל הקריאות החיצוניות מבוצעות ב-HTTPS.
- השרת בודק שוב את תקינות הקלט ואינו מריץ קוד, פקודות או HTML המגיעים מהמשתמש או מהמודל.
- להציג את הבדיחה כ-Plain Text כדי למנוע XSS. להשתמש בכותרות אבטחה מקובלות כגון `X-Content-Type-Options: nosniff`, `Referrer-Policy` ו-CSP המתאימה ל-Build; להימנע מ-CSP שמונעת Service Worker.
- לא לשמור בדיחות, כתובות דוא"ל או פרטי משתמשים באפליקציה. נתוני בקשה עדיין עוברים לשירות OpenAI לצורך יצירה, וספקי התשתית עשויים להחזיק Logs בהתאם למדיניות שלהם. `store: false` מצמצם שמירת Responses במסגרת יכולות ה-API אך אינו התחייבות לאפס עיבוד/לוגים מצד כל ספק.
- ללא Rate Limiting במוצר, בהתאם ל-PRD. להגדיר תקרת הוצאה חודשית קשיחה והתראות בחשבון OpenAI, וניטור שימוש ב-Vercel; לא להבטיח חסינות מוחלטת להצפת בקשות.

## 3. תשתיות, Hosting ו-Deployment

### 3.1 Repository וסביבות

- **Repository אחד ב-GitHub** כולל Frontend (`src/`), Backend (`api/`), תצורת Vite/PWA ומסמכי PRD ו-ARCHITECTURE.
- **ענף יחיד:** העבודה נעשית ישירות על `main`, בהתאם לנוהל העבודה ב-`CLAUDE.md`: בסוף כל Milestone, אחרי אישור בעל המוצר, מתבצעת דחיפה ל-`main`. **כל דחיפה ל-`main` נפרסת אוטומטית ל-Production.** אין ענפי עבודה ואין Pull Requests.
- **Development מקומי:** `vercel dev` — מריץ יחד את ה-Frontend (Vite) ואת ה-Function `api/joke.ts`, ומוודא שהסביבה המקומית זהה ל-Vercel. דורש חשבון Vercel ופרויקט מקושר, ולכן החשבון נפתח כבר ב-Milestone 1 (ראו ADR-1). המפתח נקרא מ-`.env` המקומי. אין צורך ב-Docker או במסד נתונים.
- **Preview לבדיקות בטלפון:** כשנדרשת בדיקה בטלפון אמיתי לפני אישור Milestone (למשל PWA ו-Offline), Claude יוצר Preview Deployment באמצעות `vercel deploy` (בלי `--prod`) — **רק אחרי שביקש וקיבל את אישור בעל המוצר**. זה יוצר כתובת HTTPS זמנית בלי לגעת ב-Production ובלי push. כברירת מחדל Vercel מגן על כתובות Preview בהתחברות לחשבון Vercel; בעל המוצר מתחבר בטלפון לחשבון שלו כדי לפתוח אותן (ראו ADR-2).
- **Production:** נפרס אוטומטית מ-`main`.
- **מפתחות OpenAI:** שניים בלבד — מפתח **פיתוח** (בקובץ `.env` המקומי ובסביבת Preview ב-Vercel) ומפתח **Production** (בסביבת Production ב-Vercel). שני המפתחות שייכים לאותו פרויקט OpenAI, שעליו מוגדרת תקרת ההוצאה.

### 3.2 Build ופריסה אוטומטית

1. לחבר את GitHub Repository ל-Vercel Project אחד (ב-Milestone 1; בעל המוצר מבצע את החיבור בעצמו בהדרכת Claude).
2. לבחור Framework Preset של **Vite**; Build Command: `npm run build`; Output Directory: `dist`.
3. Vercel מגיש את Build הסטטי ואת ה-Node.js Function שתחת `api/joke.ts` באותו Domain. להגביל את Function ל-Node.js Runtime ולא ל-Edge בלי צורך.
4. כל Push ל-`main` יוצר Production Deployment אוטומטי. Preview Deployments נוצרים ידנית בלבד, באמצעות `vercel deploy`, כמתואר ב-3.1.
5. חיבור HTTPS מובנה ב-Vercel. אפשר להשתמש בכתובת `*.vercel.app`; Domain מותאם אישית אופציונלי בלבד.
6. הפריסה אינה כוללת Database Migrations או Provisioning של תשתיות שאינן קיימות.

### 3.3 Environment Variables

| משתנה | היכן נדרש | סוד? | הערה |
|---|---|---|---|
| `OPENAI_API_KEY` | Backend: `.env` מקומי + Vercel Preview (מפתח פיתוח); Vercel Production (מפתח Production) | כן | לעולם לא לחשוף ל-Frontend; שם המשתנה מופיע ב-`.env.example` ללא ערך |

`gpt-5` מוגדר כקבוע בקוד Backend לפי דרישת המוצר. אם בוחרים לאחסן את שם המודל ב-Environment Variable מטעמי תחזוקה, ערך Production חייב להיות `gpt-5` ואין לשנותו ללא שינוי מאושר ב-PRD.

### 3.4 עלויות ותפעול

- **OpenAI GPT-5:** לפי עמוד המודל הרשמי שנבדק ב-21.10.2026, מחירי Text מוצגים כ-$1.25 למיליון Input Tokens, $0.125 למיליון Cached Input Tokens ו-$10 למיליון Output Tokens. המחיר בפועל נגזר מהיקף הקלט, פלט הבדיחה, Tokens פנימיים אם מחויבים ומהתעריף במועד השימוש. אין מכסה ברמת המוצר.
- **Vercel:** קיימת תוכנית Hobby לשימוש אישי לא מסחרי עם מכסות משאבים; Production מסחרי מצריך תוכנית מתאימה לפי תנאי השירות. Function משלם/צורך משאבים בהתאם למודל החיוב של התוכנית, ועשוי להיות כפוף למגבלות זמן וקריאות.
- **GitHub:** Repository ופעילות Git רגילה; לבדוק את תנאי התוכנית בהתאם לבעלות ולצרכים.
- **אין עלות Database, Storage או Authentication** כי שירותים אלה לא נדרשים.
- אין להבטיח עלות חודשית קבועה כשהשימוש פתוח וללא מכסות למשתמשים. העלות המרבית ל-OpenAI חסומה בתקרת ההוצאה החודשית שבעל המוצר מגדיר בחשבון (חובה לפני פרסום ה-Production), ובנוסף מוגדרות התראות עלויות.

## 4. החלטות טכניות מחייבות וגבולות הפתרון

- מסך Web יחיד, בעברית RTL, מותאם לנייד; ללא תפריטים ודפים נוספים.
- GPT-5 בלבד כמבוקש; אין Fallback למודל אחר.
- כל לחיצה יוצרת בקשה חדשה, גם באותו נושא; כפתור מושבת רק כל עוד בקשה קיימת בתהליך.
- ניתן לפתוח את מעטפת האפליקציה ב-Offline, אך לא להפיק בדיחה חדשה Offline.
- אין Backend מתמשך, Database, Sessions, Accounts, שמירת היסטוריית בדיחות, Analytics אישי, Queue או Storage חיצוני.
- אין הגבלה על מספר הבדיחות ולא מוסיפים Rate Limiting של מוצר; הגנת העלויות היא תקרת הוצאה בחשבון OpenAI ותקרה טכנית לאורך התשובה.
- GPT-5 רץ ברמת חשיבה מינימלית.
- גופנים ונכסים חזותיים נכללים בפרויקט עצמו, ללא טעינה משירותים חיצוניים.
- אין צורך ב-SSR, Next.js, Supabase, GitHub Pages או שרת Express נפרד.

## 5. מקורות רשמיים למחקר (נבדקו ב-21.10.2026)

1. [OpenAI — GPT-5 Model (יכולות, סטטוס, תמחור, Endpoints)](https://developers.openai.com/api/docs/models/gpt-5)
2. [OpenAI — Text Generation / Responses API](https://developers.openai.com/api/docs/guides/text)
3. [OpenAI — Production Best Practices](https://developers.openai.com/api/docs/guides/production-best-practices)
4. [Vercel — Vite](https://vercel.com/docs/frameworks/frontend/vite)
5. [Vercel — Vercel Functions Limits](https://vercel.com/docs/functions/limitations)
6. [Vercel — Configuring Maximum Duration](https://vercel.com/docs/functions/configuring-functions/duration)
7. [Vercel — Git Integration](https://vercel.com/docs/git)
8. [Vercel — Environment Variables](https://vercel.com/docs/environment-variables)
9. [Vercel — Hobby Plan / תנאי תוכנית](https://vercel.com/docs/plans/hobby)
10. [Vite PWA — Getting Started](https://vite-pwa-org.netlify.app/guide/)
11. [WebKit — Add to Home Screen through third-party browsers on iOS](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/)

> **הערת עדכניות:** מגבלות תכניות, תמחור ומדיניות זמינות מודלים משתנים. לפני Deployment יש לאמת שהמודל `gpt-5` נגיש בחשבון ושזמן ההרצה והתוכנית ב-Vercel מתאימים לשימוש המתוכנן. כל שינוי במודל שנדרש כתוצאה מ-Deprecation יחייב החלטת מוצר מפורשת.

## החלטות מרכזיות (ADRs)

### ADR-1: חשבון Vercel ופריסה ראשונה כבר ב-Milestone 1
**הקשר:** ההרצה המקומית של ה-Function דורשת `vercel dev`, שדורש חשבון Vercel ופרויקט מקושר. בנוסף, פריסה ראשונה בסוף הפרויקט מרכזת סיכון רב בשלב מאוחר.
**החלטה:** בעל המוצר פותח חשבון Vercel ומחבר אליו את ה-Repository כבר ב-Milestone 1. הדחיפה שמאשרת את Milestone 1 מפרסמת את המסך הראשון ל-Production.
**השלכות:** מ-Milestone 1 ואילך כל דחיפה מאושרת ל-`main` מתפרסמת לציבור. בעיות פריסה מתגלות מוקדם. Milestone 4 מתמקד בבדיקות קבלה ובהגנת עלויות.

### ADR-2: Preview Deployment ידני לבדיקות בטלפון
**הקשר:** PWA ו-Offline אפשר לבדוק בטלפון רק בכתובת HTTPS. לפי נוהל העבודה, אין push לפני אישור ה-Milestone, ולכן אי אפשר להשתמש בפריסה האוטומטית לבדיקה.
**החלטה:** לבדיקות בטלפון לפני אישור, Claude יוצר Preview באמצעות `vercel deploy` (בלי `--prod`), רק אחרי אישור בעל המוצר.
**השלכות:** אין צורך בענפים וב-Pull Requests. כתובות Preview מוגנות בהתחברות לחשבון Vercel, ולכן בעל המוצר מתחבר בטלפון. Production אינו מושפע.

### ADR-3: GPT-5 ברמת חשיבה מינימלית ועם תקרת אורך תשובה
**הקשר:** GPT-5 הוא מודל "חושב". בברירת המחדל בדיחה עלולה להימשך עשרות שניות ולעלות יותר. השירות פתוח לציבור ללא מכסות.
**החלטה:** `reasoning.effort = 'minimal'`, `max_output_tokens = 800`, ו-Timeout של 30 שניות.
**השלכות:** תשובות מהירות וזולות יותר. אם איכות הבדיחות נמוכה מדי, אפשר לעבור ל-`'low'` ולתעד בעדכון ל-ADR זה.

### ADR-4: גופנים כחלק מהפרויקט
**הקשר:** גופנים מ-Google Fonts אינם זמינים Offline, ומחייבים גם התאמה של כללי ה-CSP.
**החלטה:** Heebo ו-Assistant נכללים באמצעות חבילות `@fontsource` ונכנסים ל-Precache.
**השלכות:** המראה זהה גם Offline. גודל ההורדה הראשונה גדל מעט, ולכן נכללים רק המשקלים שבשימוש.

### ADR-5: הפריסה הראשונה של Milestone 1 ל-Production לפני הדחיפה
**הקשר:** ב-Vercel, הפריסה הראשונה של פרויקט חדש הופכת תמיד ל-Production ומקבלת את הכתובת הציבורית — גם ב-`vercel deploy` רגיל וגם עם `--target preview`. לכן ב-Milestone 1 לא ניתן ליצור Preview לפני שקיימת פריסת Production (שתי פריסות כאלה נמחקו).
**החלטה:** בעל המוצר אישר במפורש פריסה ידנית ל-Production (`vercel deploy --prod`) כבר ב-Milestone 1, כדי לבדוק את המסך בטלפון לפני הדחיפה. מכאן והלאה, Preview נוצר עם `vercel deploy --target preview`, ויש לוודא אחרי כל פריסה שה-target שלה הוא preview.
**השלכות:** מסך Milestone 1 ציבורי עוד לפני האישור — חריגה חד-פעמית מ-ADR-1. מ-Milestone 2 ואילך תהליך ה-Preview שב-ADR-2 עובד כמתוכנן.

### ADR-6: מבנה ה-Function — לוגיקה נפרדת עם פונקציית יצירה מוזרקת
**הקשר:** נדרשות בדיקות Vitest לאימות הקלט של `/api/joke`, בלי לפנות ל-OpenAI (עלות, מפתח, זמן).
**החלטה:** `api/joke.ts` הוא קובץ חיבור דק בחתימת Web (`export default { fetch }`). האימות וקודי התשובה ב-`server/jokeApi.ts` (`handleJokeRequest(request, generate)`), והקריאה ל-OpenAI ב-`server/generateJoke.ts`. בבדיקות מועברת פונקציית יצירה מזויפת. ה-SDK מוגדר עם `maxRetries: 0`, כדי שלא יהיו חיובים כפולים וחריגה מה-Timeout. ייבוא יחסי בצד השרת נכתב עם סיומת `.js` (הפרויקט ESM).
**השלכות:** בדיקות מהירות וחינמיות. תיקיית `server/` אינה Endpoint (רק קבצים תחת `api/` הם Functions). זמני תגובה שנמדדו ב-`vercel dev`: כ-5–8 שניות לבדיחה, ברמת חשיבה `minimal`.
