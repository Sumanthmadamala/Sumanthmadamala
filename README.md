# Mini Angular project using the Pretext library

This repository includes a runnable **mini Angular app** (`mini-angular-pretext/`) that demonstrates a practical Pretext use case:

> **Predicting chat bubble height before rendering** to avoid layout shifts in live chat and AI streaming interfaces.

---

## Why use Pretext in Angular?

Most chat UIs need text measurement to size message bubbles. If you measure using DOM APIs repeatedly (`offsetHeight`, `getBoundingClientRect`), you can trigger reflow and cause jank.

`@chenglou/pretext` avoids that by splitting the work:

1. `prepare(text, font)` once for each text + font pair.
2. `layout(prepared, width, lineHeight)` many times (fast math, no DOM reads).

This is ideal for Angular apps with dynamic chat content.

---

## Complete use case walkthrough

### Scenario

You are building an Angular chat UI where incoming messages stream token-by-token.

Without prediction:

- bubble heights keep changing,
- message rows jump,
- scroll position becomes unstable.

With Pretext:

- you predict height in advance,
- reserve space before paint,
- keep scrolling smooth and stable.

### Flow in this mini app

1. User types a draft message.
2. Angular signal stores the text.
3. A computed signal calls:
   - `prepare(text, font)`
   - `layout(prepared, maxBubbleWidth, lineHeight)`
4. UI immediately shows:
   - predicted line count,
   - predicted height,
   - bubble preview constrained to that predicted height.

This same pattern scales to virtualized chat lists and streaming AI responses.

---

## Project structure

```text
mini-angular-pretext/
  ├─ public/.gitkeep
  ├─ src/
  │  ├─ app/
  │  │  ├─ app.component.ts      # Pretext integration logic
  │  │  ├─ app.component.html    # Input + metrics + bubble preview
  │  │  └─ app.component.css     # Demo styling
  │  ├─ main.ts
  │  ├─ index.html
  │  └─ styles.css
  ├─ angular.json
  ├─ package.json
  ├─ tsconfig.json
  └─ tsconfig.app.json
```

---

## Local setup (fixed install path)

From repo root:

```bash
cd mini-angular-pretext
npm install
npm run typecheck
npm start
```

Then open: `http://localhost:4200`

### If install still fails locally

Try these steps once:

```bash
cd mini-angular-pretext
rm -rf node_modules package-lock.json
npm cache verify
npm install --registry=https://registry.npmjs.org/
```

If your machine is on a corporate network, ensure npm is not forced to a blocked private registry.

---

## Key integration snippet

```ts
import { layout, prepare } from '@chenglou/pretext';

const prepared = prepare(text, '16px Inter');
const result = layout(prepared, 320, 24);
// result.height + result.lineCount drive stable UI sizing
```

---

## What this demonstrates

- Angular standalone component + signals.
- Fast, deterministic text layout prediction.
- A concrete pattern for jank-free chat interfaces.
