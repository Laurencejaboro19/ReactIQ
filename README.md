# ReactIQ

**Reaction mechanism, simplified.**

ReactIQ is an AI-powered learning app that helps science students truly understand reaction mechanisms. Instead of memorising arrows, students watch how electrons move, how bonds break and how bonds form — step by step, in an interactive and visual way.

Built for students in Chemistry, Pharmacy, Pharmacology, and Biochemistry / Medical Biochemistry.

## What's in this repo

A mobile-first marketing site plus a working product demo:

- **Landing page** — hero with a live, looping 2D SN2 mechanism, the problem, the three learning modes, reaction library preview, Free vs Pro pricing, roadmap, and waitlist.
- **Reactions tab** (`/reactions`) — searchable, filterable library of 12 reaction types (SN1, SN2, E1, E2, Aldol, Grignard, Ozonolysis, Diels–Alder, Fischer esterification, Claisen, Wittig, Friedel–Crafts) with Pro locks.
- **Reaction detail** (`/reactions/:slug`) with three modes:
  - **2D mode** — step-by-step mechanism player with animated curly arrows, bond breaking/forming, play/pause, step scrubber and a "loop forwards and backwards" toggle. Full mechanisms for SN2, SN1 and E2.
  - **3D mode** — interactive ball-and-stick animation (React Three Fiber) that plays repeatedly backwards and forwards, with orbit/zoom, frame stepping, speed, spin and ball-and-stick / sticks / spacefill styles. SN2 shows backside attack and Walden inversion. Gated as a Pro feature with a "Preview anyway" option.
  - **AI chat mode** — tutor chat UI with suggested questions and a credits counter, answered from a local knowledge base (no backend yet).
- **Pricing page** (`/pricing`) — Free vs Pro comparison.

All reaction content lives in one typed file: [`src/data/reactions.ts`](src/data/reactions.ts). Add a reaction by appending to the `reactions` array.

## Brand

Primary orange `#FF6405` on charcoal. Display font Space Grotesk, body Inter.

## Stack

- React 19 + TypeScript
- [TanStack Start](https://tanstack.com/start) (TanStack Router, SSR via Nitro)
- Vite 8, Tailwind CSS v4, shadcn/ui
- framer-motion for UI motion
- three.js, @react-three/fiber, @react-three/drei for 3D mode

Originally scaffolded with [Lovable](https://lovable.dev).

## Running locally

```bash
bun install        # or: npm install
bun run dev        # http://localhost:8080 (or the port Vite prints)
```

Other scripts:

```bash
bun run build      # production build (auto-detects the host: Vercel, Cloudflare, Node)
bun run preview    # preview the production build
bun run test       # vitest
bun run lint       # eslint
```

## Deploying

The project is deployed on **Vercel**. Nitro auto-detects Vercel at build time and emits a Vercel Build Output with a Node.js function for SSR, so no extra configuration is needed — connect the repo and deploy.

## Plans

| Feature | Free | Pro |
| --- | --- | --- |
| 2D mode | Yes, uses credits | Yes, with more credits |
| AI chat mode | Yes, uses credits | Yes, with more credits |
| 3D mode | Not available | Included |
| Reaction library | Some mechanisms locked | Full access |
| AI model quality | Standard | Smarter model |
| Voiceover on 2D mechanisms | Not available | Included |

## Roadmap

- **Now:** landing screen, reactions tab with a starter set, 2D / 3D / AI chat end to end, credit system and the Free vs Pro split.
- **Later:** asking questions during the voiceover; wider coverage of reactions and course-specific content.

## License

© 2026 ReactIQ. All rights reserved.
