---
draft: true
title: One Point Oh
description: After four years in the making, maybe it wasn't worth the wait.
date: "2026-10-07"
authors:
  name: Lily Skye
  url: https://suchipi.com/
---

Earlier this week, [I released version 1.0.0](https://github.com/suchipi/yavascript/releases/tag/v1.0.0). This is the first "stable" version released since I started work on YavaScript [over 4 years ago](https://github.com/suchipi/yavascript/commit/49eadae879751da990d389f4cc7e197cbd72bb20).

I built YavaScript because I was tired of maintaining shell scripts written in bash and wanted a TypeScript-capable runtime that I could rely on even when node_modules or Node.js itself weren't present.
Its intended use was for things like a workplace `bootstrap.sh` which sets up your dev environment, or a `start.sh` which runs the app and its dependencies. These were scripts that needed to work before `npm install` had run, and therefore couldn't depend on anything from node_modules.
Sometimes they even needed to work when Node.js wasn't present yet (ie. in the script that ran `nvm use`, or a script that ran outside docker when only using Node from within docker). Scripts like these were some of the biggest maintenance burdens I had at two jobs back-to-back.

In the intervening years, the landscape of software development has changed a lot (talk about an understatement). There were three points in time where I realized the project was no longer going to be as helpful or useful as I had hoped it would be when I came up with the idea:

- When [Bun](https://bun.com/) came onto the scene, there was now a Node-compatible runtime which could run TypeScript without any node_modules.
- When Node.js 22 added support for running TypeScript directly (with some caveats), running TypeScript without node_modules became easy.
- When AI programming became good enough for people to use seriously, the entire category of "good UX for those who maintain repo shell scripts" was invalidated.

This feeling sucked. Someone else eliminated the problem I was trying to solve. I should have been happy that the UX for everyone had improved. But it was hard not to feel like my time was a waste.

But I kept working on YavaScript. Not because it was going to help anyone anymore. Because it was mine, and I needed to make something. I desperately needed to make something.

And now it's finally "done". 1.0.0 was released.

Maybe no one else will ever use it. Maybe if I had been faster, someone else would have.

It doesn't really matter. No one writes shell scripts by hand anymore anyway.

But I needed to make it. So I did.
