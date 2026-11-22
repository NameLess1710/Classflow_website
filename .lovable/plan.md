# Plan: move the app to a simpler JavaScript setup, in small stages

## What I found

- 70 code files are TypeScript (about 9,600 lines). 46 of them are ready-made interface parts (buttons, dialogs, menus and so on). Only 17 of those 46 are actually used.
- Several installed libraries are only used by those unused parts: carousel, OTP input, date picker, form helpers, resizable panels, drawer and validation.
- The app builds and loads today. The sign-in page and the dashboard both open.
- Login, the profile and all academic data currently live only in the browser, as sample data.
- The app is still branded **CampusPulse AI** on screen. Your brief calls it **ClassFlow**. I've asked which name to use.

## Things that work differently from the brief

1. **Server code goes in server functions, not Supabase Edge Functions.** This app runs on TanStack Start, which has its own secure server functions. They live in the same project, are written in plain JavaScript, and keep API keys off the student's browser. That covers what Edge Functions would do, with one less moving part. College API calls will use them.
2. **A few files have to stay TypeScript.** Lovable Cloud (the Supabase backend) creates its own connection files and a sign-in guard. They are regenerated automatically and you never need to edit them. The `typescript` package also stays installed because those files and the build tools need it. All app code you read and write will be JavaScript.
3. **Trade-off:** JavaScript has no automatic type checking, so the editor will catch fewer mistakes. To keep code easy to follow, I'll add short comments that describe what each data object contains.

## Stages (I test the app after every stage before moving on)

### Stage 1: Clean up (no visible change)
- Delete the 29 unused interface parts and the libraries only they use.
- Check that every page still opens and the existing tests pass.

### Stage 2: Convert shared logic to JavaScript
- Convert the calculations (attendance, CGPA, dates), the sample data, browser storage and navigation lists.
- Replace `types.ts` with short comment blocks that describe each data shape.

### Stage 3: Convert components to JSX
- Convert the 17 interface parts we keep, the layout (sidebar, top bar, search), logo, cards and the feature pieces (attendance calculator, CGPA simulator and so on).

### Stage 4: Convert pages and app setup
- Convert all 15 page files plus the app shell, router, server entry and startup file.
- Configure the router so its auto-generated route list is also JavaScript.
- Convert the tests and update the Vite, test and lint settings for JavaScript.

### Stage 5: Reorganise folders (moves only, no logic changes)
```text
src/
  routes/            one file per page (required by the router)
  components/
    ui/              basic building blocks (button, input, dialog...)
    common/          reusable app pieces (cards, chips, page header)
    layout/          sidebar, top bar, search
    <feature>/       pieces used by one page only (attendance, cgpa...)
  data/              sample data (used until the college API exists)
  utils/             pure calculations: attendance, CGPA, dates
  storage/           browser-saved data (notes, CGPA plans...)
  services/
    academic-data.js one place pages get academic info from
    college-api/     placeholder for the future college API (server side)
    supabase/        ClassFlow account, profile and preferences
```

### Stage 6: Accounts with Lovable Cloud (Supabase)
- Turn on Lovable Cloud. Replace the simulated login and registration with real ClassFlow accounts (email and password).
- Add two tables: **profiles** (name, roll number, department, year, semester, section, phone, bio) and **preferences** (attendance limit and notification switches). Each student can only read and edit their own rows.
- Profile and Settings pages save to Cloud instead of the browser.
- Attendance, assignments, notices, timetable and exams are **not** copied into the database. They stay as sample data until the college API arrives.
- Personal notes, CGPA plans and assignment checkmarks stay in the browser for now. I've asked whether they should move to Cloud.

### Stage 7: College API placeholder (no fake API)
- Add `services/college-api/` with one secure server-side helper that will read the API address and key from secrets once you have them. It defines no endpoints, and nothing calls it yet.
- `services/academic-data.js` is the only place pages get academic data from. Today it returns sample data. Later it will switch to the college API, with no page changes needed.
- I'll add a short README section explaining how to plug in the real API.

## What might be affected
- **Login:** after Stage 6, the "demo student account" button needs a real account. I'll keep a clear sign-up path so you aren't locked out.
- **Saved browser data:** profile edits saved in the browser before Stage 6 won't carry over to the new account.
- **Everything else** (pages, design, navigation, mobile layout, sample data, Ask AI demo prompts) should look and behave the same.

## Technical details
- Files that change: everything under `src/` except generated files (`.ts/.tsx` become `.js/.jsx`), plus `package.json`, `vite.config`, `vitest.config`, `eslint.config.js`, `tsconfig.json` (kept only for generated files, with `allowJs`), `components.json` (`tsx: false`) and `README.md`.
- Router: TanStack router plugin `generatedRouteTree: src/routeTree.gen.js`. Start entry files become `router.jsx`, `start.js` and `server.js`. If any entry file can't be JS, it stays a small TS file and I'll tell you.
- Libraries removed: embla-carousel-react, input-otp, react-day-picker, react-hook-form, @hookform/resolvers, react-resizable-panels, vaul, zod, vite-tsconfig-paths, unused @radix-ui packages, typescript-eslint and @types/* (if lint no longer needs them).
- Libraries kept: TanStack Router/Start/Query, Tailwind, recharts, date-fns, sonner, lucide, cmdk and the used Radix parts.
- Server functions: `createServerFn` in `*.functions.js` files. Secrets are read only inside handlers.
- Auth: Supabase Auth with email and password. The pathless sign-in guard layout replaces the browser-only session check, and page URLs stay the same.
