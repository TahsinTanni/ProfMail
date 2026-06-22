# ProfMail ✉️

**AI-powered cold email generator for graduate school applicants.**

ProfMail scrapes a professor's lab page in real time, analyzes the overlap between their research and your thesis, and generates a personalized outreach email — in seconds.

🔗 **Live:** [prof-mail.vercel.app](https://prof-mail.vercel.app)

---

## The Problem

Cold emails to professors get ignored when they're generic. Writing a genuinely personalized email — one that references specific papers, draws real connections to your own work, and strikes the right tone — takes hours per professor. ProfMail automates that entire process.

---

## Features

-  **Real-time lab scraping** via Firecrawl API — pulls publications and research themes directly from the professor's page
-  **AI overlap analysis** — Gemini 1.5 Flash identifies specific connections between your background and the professor's work
-  **Tone & length controls** — toggle between Formal / Semi-formal and Short / Detailed
-  **Editable workspace** — refine the output inline before sending
-  **Regenerate on demand** — get a fresh draft without re-entering inputs
-  **One-click copy / download** — export as `.txt`
-  **Local email history** — stores your last 5 generated emails for quick reference

---

## Tech Stack

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Bundler | Vite 6 |
| Styling | Tailwind CSS v4 |
| AI | Groq API (llama-3.3-70b-versatile) |
| Scraping | Firecrawl API |

---

## Run Locally

```bash
git clone https://github.com/TahsinTanni/ProfMail.git
cd ProfMail
npm install
npm run dev
```

Create a `.env` file in the root:

```env
VITE_GROQ_API_KEY=your_groq_api_key
VITE_FIRECRAWL_API_KEY=your_firecrawl_api_key
```

| Key | Where to get it |
|---|---|
| `VITE_GROQ_API_KEY` | [console.groq.com](https://console.groq.com) 
| `VITE_FIRECRAWL_API_KEY` | [firecrawl.dev](https://firecrawl.dev) 

---

## How It Works

```
Enter your research background + professor's lab URL
            ↓
    Firecrawl scrapes the lab page
            ↓
  Gemini finds overlap with your thesis
            ↓
  Personalized email is generated
            ↓
    Edit → Copy / Download → Send
```

---

## Author

**Tahsin Tanni** — BSc CSE, BRAC University
Research: LLM Security & Adversarial Robustness

- Portfolio: [tahsintanni.github.io](https://tahsintanni.github.io)
- GitHub: [@TahsinTanni](https://github.com/TahsinTanni)

---

## License

MIT
