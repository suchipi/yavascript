---
title: One Point Oh
description: After four years in the making, maybe it wasn't worth the wait. (2 minute read)
date: "2026-10-07"
authors:
  name: Lily Skye
  url: https://suchipi.com/
---

I built YavaScript because I was tired of maintaining shell scripts written in bash and wanted a cross-platform TypeScript-capable runtime that I could rely on even when node_modules or Node.js itself weren't present.

Earlier this week, [I released YavaScript version 1.0.0](https://github.com/suchipi/yavascript/releases/tag/v1.0.0). This is the first "stable" version released since I started work on YavaScript [over 4 years ago](https://github.com/suchipi/yavascript/commit/49eadae879751da990d389f4cc7e197cbd72bb20).

Since then, the landscape of software development has changed dramatically. There were three distinct points in time where I realized the project was no longer going to be as helpful or useful as I had hoped it would be when I came up with the idea:

- When [Bun](https://bun.com/) came onto the scene, there was now a Node-compatible runtime which could run TypeScript without any node_modules.
- When [Node.js 22 added support for running TypeScript directly](https://nodejs.org/docs/latest-v22.x/api/typescript.html#type-stripping) via type stripping, you could now do the same without switching runtimes.
- When AI programming became good enough for people to use seriously, the entire category of "good UX for those who maintain repo shell scripts" was invalidated.

At each of these three points, I felt bad. Someone else had eliminated the problem I was trying to solve. I should have been happy that the UX for everyone had improved. But it was hard not to feel like my time was a waste.

But I kept working on YavaScript. Not because it was going to help anyone anymore. Because it was mine, and I needed to make something. I desperately needed to make something.

And now it's finally "done". 1.0.0 is out.

Maybe no one else will ever use it. Maybe if I had been faster, someone else would have.

It doesn't really matter. Everyone is writing their shell scripts with AI now anyway.
