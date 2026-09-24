<div align="center">

# Learna

**Know it cold. _Walk in ready._**

For the hour before your interview — a free interview question bank that turns 54 categories and 810 modules into quick-recall Q&A, so you skim what matters instead of rereading a whole course.

![Next.js](https://img.shields.io/badge/Next.js-16.3.5-black?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss&logoColor=white)
![Resend](https://img.shields.io/badge/Email-Resend-black)
![Fonts](https://img.shields.io/badge/Fonts-NCL_Gasdrifo_%7C_Raleway_%7C_Jost-141414)

[**Browse categories**](/category) · [**About**](/about) · [**Contact**](/contact)

</div>

---

## By the numbers

<div align="center">

| **54+** | **810+** | **294+** |
|:---:|:---:|:---:|
| categories | topic modules | questions &amp; answers |

</div>

Languages, frameworks, databases, and DevOps — every tool that shows up in an interview, broken into focused modules with Beginner, Intermediate, and Advanced Q&A.

---

## Built for the days before an interview

> Not another course platform. Learna is where you go to refresh fast, and where developers go to rehearse the real thing.

### Categorized question banks
Every tool and topic — JavaScript, React, SQL, System Design — broken into quick question-and-answer pairs you can skim in minutes.

### Interview-day quick recall
A focused skim mode built for the hour before your interview, not a semester-long course.

### Live code editor for mock rounds
Open a real editor, solve a prompt, and run your code — practicing the format of the actual interview, not just reading about it.

---

## Three steps before you walk in

| `01` Pick your category | `02` Skim or dive deep | `03` Practice in the editor |
| --- | --- | --- |
| JavaScript, React, SQL, System Design, or anything else on your interview list. | Read quick Q&A for a fast refresh, or expand any answer for the full explanation. | Open a mock coding round and solve real problems in a live code environment. |

---

## Every tool, one place

Languages, frameworks, and the tools around them — if it shows up in an interview, it's covered here.

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="40" height="40" alt="JavaScript" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="40" height="40" alt="TypeScript" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" width="40" height="40" alt="Python" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" width="40" height="40" alt="Java" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40" height="40" alt="React" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="40" height="40" alt="Next.js" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="40" height="40" alt="Node.js" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="40" height="40" alt="HTML5" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="40" height="40" alt="CSS3" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" width="40" height="40" alt="Tailwind CSS" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="40" height="40" alt="PostgreSQL" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" width="40" height="40" alt="MongoDB" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" width="40" height="40" alt="Docker" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="40" height="40" alt="Git" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" width="40" height="40" alt="GraphQL" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" width="40" height="40" alt="Figma" />
</p>

<p align="center"><sub>…and 50+ more across <a href="/category">/category</a></sub></p>

---

## Design system

The UI runs on a small token set — display type, wide tracking, gold on ink:

| Token | Value | Role |
| :--- | :--- | :--- |
| Ink | `#141414` | Headings, primary text, black CTA surfaces |
| Gold | `#B8860B` | Eyebrows, accents, `✦` brand mark |
| Paper | `#FAFAF8` | Cards, inputs, hover surfaces |
| Copy | `#5B5B5B` | Body paragraphs |
| Muted | `#8A8A8A` | Placeholders, meta labels |
| Alert | `#C0392B` | Form errors, placeholder chips |

**Type** — `NCL Gasdrifo` for display headings, `Raleway` (home) and `Jost` (app pages) via `next/font/google`, almost everything on `tracking-widest`. **Shape** — pill buttons (`rounded-full`), `rounded-2xl` cards with `border-black/5`, the navbar's diagonal black `clip-path` wedge, and the footer's `Learna ✦` marquee.

---

## Getting Started

```bash
# 1. Install
npm install

# 2. Create .env with your keys (see table below)
#    RESEND_API_KEY=re_...
#    NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. Site links in this README are root-relative (`/category`, `/about`, …) — point them at your deployed origin once `NEXT_PUBLIC_SITE_URL` is set.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build (static-generates all 810 module pages) |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

### Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | For contact form delivery | Server-side key used by `POST /api/contact` to send branded emails via [Resend](https://resend.com). Keep it in `.env` — never commit it. |
| `NEXT_PUBLIC_SITE_URL` | At deploy time | Absolute origin used for `metadataBase`, `robots.txt`, and `sitemap.xml` (defaults to `http://localhost:3000`). |

---

## Project structure

```
src/
├── app/
│   ├── (guest)/page.jsx        # Home / landing
│   ├── about/                  # About Learna
│   ├── category/               # Category index + [slug] module pages (810 SSG routes)
│   ├── contact/                # Contact form (custom themed dropdown)
│   ├── privacy-policy/ · terms/
│   ├── api/contact/route.js    # Resend email endpoint
│   ├── loading.jsx · not-found.jsx
│   ├── robots.js · sitemap.js  # SEO file conventions
│   └── layout.jsx              # Root metadata + fonts + Navbar
├── common/                     # UI: Home, About-Us, Category, Contact-Us, Policy, Terms, Footer, Navbar, Loading
└── lib/
    ├── category.js             # 54 categories · 810 modules
    ├── questionAndAnswer.js    # Curated Q&A aggregates
    ├── qa/                     # Q&A banks by domain
    ├── mockTest.js             # Mock-round generator
    └── seo.js                  # SITE_URL · pageOg helper
```

---

## Routes

| Route | Description |
| --- | --- |
| `/` | Landing — hero, features, how-it-works, tech stack |
| `/category` | All 54 categories with search, level filters, sort |
| `/category/[slug]` | 810 module pages — Q&A, difficulty badges, prev/next |
| `/about` | Why Learna exists, audience, stats |
| `/contact` | Contact form → branded email via Resend |
| `/privacy-policy` · `/terms` | Legal pages with anchored sections |
| `/robots.txt` · `/sitemap.xml` | Auto-generated SEO files (816 URLs) |
| `/api/contact` | `POST` JSON — validates fields, sends email |

**SEO** — root metadata (title template `%s | Learna`, description, keywords, `index/follow` + generous `googlebot`), per-page canonicals and Open Graph tags, `robots.txt` (allows `/`, disallows `/api/`), and a sitemap of every module. Branded `loading` UI is mapped to every segment; `not-found` renders a styled 404 with `noindex`.

---

<div align="center">

### Your next interview starts here

_Free to start. Browse a category or open the code editor right now._

[**Start practicing free →**](/category)

<br/>

**Learna** ✦ **Learna** ✦ **Learna** ✦ **Learna**

<sub>© 2026 Learna — Quick recall for the hour before your interview.</sub>
<sub> · <a href="/privacy-policy">Privacy</a> · <a href="/terms">Terms</a></sub>

</div>
