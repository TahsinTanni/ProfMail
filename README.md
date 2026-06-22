# ProfMail ✉️

> AI-powered cold email generator for graduate school applicants — crafts research-aligned outreach emails by analyzing the overlap between your thesis and a professor's published work.

🔗 **Live Demo:** [prof-mail.vercel.app](https://prof-mail.vercel.app)

---

## What Is ProfMail?

Cold emailing professors is one of the highest-leverage steps in a grad school application — and one of the most time-consuming to do well. Generic emails get ignored. ProfMail fixes that.

You provide your research background and a professor's lab URL. ProfMail scrapes their publications in real time, identifies genuine overlap with your work, and generates a personalized outreach email that reads like you spent hours writing it — because the AI did.

Built specifically for applicants targeting research-focused MSc and PhD programs.

---

## Features

- **Real-Time Lab Scraping** — Uses the Firecrawl API to crawl professor lab pages and extract recent publications, projects, and research themes live
- **AI-Powered Overlap Analysis** — Gemini 1.5 Flash identifies specific connections between your research background and the professor's work, then writes around them
- **Tone & Length Controls** — Toggle between Short / Detailed length and Formal / Semi-formal tone to match your style and the professor's vibe
- **Interactive Email Workspace** — Edit the output inline, then copy to clipboard or download as `.txt` in one click
- **Regenerate on Demand** — Not satisfied? Hit regenerate for a fresh draft without re-entering your inputs
- **Local Email History** — Automatically saves your last 5 generated emails locally, accessible in a collapsible sidebar for quick reference

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Bundler | Vite 6 |
| Styling | Tailwind CSS v4 |
| AI Backend | Google Gemini API (Gemini 1.5 Flash) |
| Scraping | Firecrawl API |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com) API key (free tier works)
- A [Firecrawl](https://firecrawl.dev) API key

### Installation

```bash
# Clone the repo
git clone https://github.com/TahsinTanni/ProfMail.git
cd ProfMail

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIRECRAWL_API_KEY=your_firecrawl_api_key_here
```

> **Get your keys:**
> - Gemini: [aistudio.google.com](https://aistudio.google.com) → Get API Key (free)
> - Firecrawl: [firecrawl.dev](https://firecrawl.dev) → Dashboard → API Keys

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Deploying to Vercel

1. Push the repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Under **Project Settings → Environment Variables**, add:
   - `VITE_GEMINI_API_KEY`
   - `VITE_FIRECRAWL_API_KEY`
4. Click **Deploy**

That's it. No server needed — fully client-side.

---

## How It Works

```
User inputs research background + professor's lab URL
        ↓
Firecrawl scrapes the lab page for publications & research themes
        ↓
Gemini analyzes overlap between your work and the professor's
        ↓
A personalized cold email is generated with specific talking points
        ↓
Edit, regenerate, copy, or download
```

---

## Project Structure

```
ProfMail/
├── public/
├── src/
│   ├── components/       # UI components
│   ├── lib/              # API clients (Gemini, Firecrawl)
│   └── main.tsx
├── .env.example
├── index.html
├── vite.config.ts
└── package.json
```

---

## Environment Variables Reference

| Variable | Description |
|---|---|
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI generation |
| `VITE_FIRECRAWL_API_KEY` | Firecrawl API key for web scraping |

See `.env.example` for a template.

---

## Author

**Tahsin Tanni**
BSc in Computer Science & Engineering, BRAC University
Research: LLM Security & Adversarial Robustness

- GitHub: [@TahsinTanni](https://github.com/TahsinTanni)
- Portfolio: [tahsintanni.github.io](https://tahsintanni.github.io)

---

## License

MIT License — feel free to fork and adapt for your own outreach workflow.
