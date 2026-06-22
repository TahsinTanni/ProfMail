# ProfMail

ProfMail is an intelligent cold email generator designed for academic outreach and graduate school research applications. It automatically scrapes target research lab directories and generates highly personalized emails aligning student credentials with professor publications.

## Features
- **Dynamic Crawler Scraping:** Uses Firecrawl API to extract real-time research papers and projects from lab directories.
- **Tailored Gemini Output:** Leverages Gemini 1.5 Flash to write custom introductions highlighting genuine academic overlap.
- **Customizable Tone & Length:** Interactive toggle options for adjusting output email lengths (Short, Detailed) and tones (Formal, Semi-formal).
- **Interactive Workspace:** Clean editing environment with options to instantly copy, download (.txt), or regenerate drafts.
- **Local Storage History:** Automatically indexes and stores up to 5 recent email outputs locally for collapsible reference.

## Tech Stack
- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8
- **Styling:** Tailwind CSS v4
- **Scraping Backend:** Firecrawl API
- **AI Backend:** Google Gemini API (Gemini 1.5 Flash)

## How to Run Locally
1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (see below).
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

## Environment Variables
Create a `.env` file in the project root with the following:
```env
VITE_GEMINI_API_KEY=your_gemini_key_here
VITE_FIRECRAWL_API_KEY=your_firecrawl_key_here
```
- **VITE_GEMINI_API_KEY:** Get a free Google Gemini API key from [Google AI Studio](https://aistudio.google.com).
- **VITE_FIRECRAWL_API_KEY:** Register and copy your scraping token from [Firecrawl Dashboard](https://firecrawl.dev).

## Deploy on Vercel
1. Push your local project to a GitHub repository.
2. Connect your GitHub repository inside the [Vercel Dashboard](https://vercel.com).
3. Under Project Settings, configure both environment variables (`VITE_GEMINI_API_KEY` and `VITE_FIRECRAWL_API_KEY`).
4. Click **Deploy**.