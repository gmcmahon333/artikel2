# Deploy it (the simple way — no database)

This path has **no login, no database, no environment variables**. The app saves
everything on your device and works offline. You can have it live and on your
phone in about 15 minutes. (Want it synced across phone *and* laptop later? See
the Supabase section in README.md — the app is already built to switch with no
code changes.)

## Step 1 — put it online

Pick whichever feels easier. Both give you a public link like
`https://artikel-yourname.vercel.app`.

### Option A — clicks only (recommended)
1. Push this folder to a new GitHub repo (or drag it into github.com's "new
   repository" uploader).
2. Go to **vercel.com** → **Add New… → Project** → import that repo.
3. Vercel detects Vite automatically. Don't add any environment variables.
   Click **Deploy**.
4. Done. Every time you push a change to GitHub, it redeploys itself.

### Option B — one command
From this folder in a terminal:
```bash
npm install
npm run build
npx vercel --prod
```
Follow the prompts (log in, accept defaults). It uploads and gives you the link.

> Netlify works exactly the same way — either connect the repo, or run
> `npm run build` and drag the `dist` folder onto app.netlify.com.

## Step 2 — install it on your phone

Open your new link in your phone's browser, then:

- **iPhone (Safari):** tap the Share button → **Add to Home Screen**.
- **Android (Chrome):** tap the ⋮ menu → **Install app** (or "Add to Home
  Screen").

It now behaves like a real app — full screen, its own icon, and it works with no
internet. Your reviews and everything the app learns about you live on that
device.

## Good to know

- **Nothing to maintain.** No server, no database, no bills. It's just files on a
  CDN.
- **Your data is per-device.** Reviews on your phone stay on your phone. That's
  the trade for zero setup. If you clear the browser's site data, progress
  resets — so if this becomes your daily driver, that's the moment to add the
  Supabase sync from README.md.
- **The learning still works.** FSRS adapts to how you answer, per card, entirely
  on-device. The only thing the no-database path skips is the deeper "refit the
  model to your personal curve" step, which needs a server and only matters after
  hundreds of reviews.
