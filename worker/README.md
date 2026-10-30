# Ask Uwe

A Cloudflare Worker behind the "Ask" box on djui.github.io. It answers a visitor's question with Claude Haiku, using only `src/context.md`, and keeps the API key off the page.

## Deploy

1. Create an Anthropic API key at console.anthropic.com and set a monthly spend limit (Settings, Limits), e.g. $5.
2. From this folder:

   ```bash
   npm install
   npx wrangler login
   npx wrangler secret put ANTHROPIC_API_KEY
   npx wrangler deploy
   ```

3. Copy the `https://ask-uwe.<you>.workers.dev` URL into `ASK_URL` at the top of the Ask section in `assets/site/site.js`. The Ask box stays hidden until it's set.

## Change what it knows

Edit `src/context.md` and run `npx wrangler deploy` again. Keep it to facts that are already public.

## Limits

- 10 questions per minute per visitor IP (`wrangler.toml`).
- Questions are cut at 500 characters; answers are at most 3 sentences.
- Only requests from djui.github.io and localhost:4173 are accepted.
