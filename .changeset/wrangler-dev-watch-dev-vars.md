---
"wrangler": patch
---

Reload `wrangler dev` when `.dev.vars` or `.env` files change

Previously, `wrangler dev` only watched the Wrangler configuration file, so edits to `.dev.vars`, `.dev.vars.<env>`, the `.env` fallback files or `--env-file` paths were ignored until `wrangler dev` was restarted. These files are now watched too, including when one is created or deleted, since that can change which file the local bindings are read from. A file in a directory that does not exist yet is not picked up.
