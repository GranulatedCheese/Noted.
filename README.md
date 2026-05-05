# Noted.

**AI-powered canvas note-taking for students.**

Draw your notes. Underline a term to define it. Box an equation to solve it. AI responses appear directly on your canvas — no context switching, no copy-pasting.

---

## Features

- **Underline to Define** — draw a flat line under any word or phrase and get an instant, context-aware definition pinned to your canvas
- **Box to Solve** — draw a closed shape around an equation or concept and get a step-by-step solution
- **Multi-provider AI** — works with Gemini (default), ChatGPT (GPT-4o Mini), or Claude (Haiku); bring your own API key
- **Multi-page notebooks** — organize your work into named notebooks, each with unlimited pages
- **Swipe toolbar** — swipe left from the right edge of the canvas to reveal drawing tools; swipe right to hide
- **Markdown responses** — AI cards render full markdown: headers, code blocks, tables, bullet lists
- **Dark / light mode**
- **100% local** — all notes stored in your browser via IndexedDB; no accounts, no servers, no tracking

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm

### Installation

```bash
git clone https://github.com/GranulatedCheese/Noted.
cd "Noted./noted"
npm install
npm run dev
```

Open `http://localhost:3000`.

---

## Adding Your API Key

Noted. requires an API key from your chosen AI provider. Keys are stored in your browser's `localStorage` and are never sent to any server.

1. Open the app and click the **Settings** icon (gear icon in the sidebar)
2. Select your preferred AI provider: **Gemini**, **ChatGPT**, or **Claude**
3. Paste your API key and click **Save Changes**

| Provider | Where to get a key |
|---|---|
| Gemini (default) | [Google AI Studio](https://aistudio.google.com) |
| ChatGPT | [OpenAI Platform](https://platform.openai.com/api-keys) |
| Claude | [Anthropic Console](https://console.anthropic.com) |

> API usage may incur costs depending on your provider and usage volume. Noted. uses lightweight models (Gemini 2.0 Flash Lite, GPT-4o Mini, Claude Haiku) to keep costs low.

---

## How to Use AI Gestures

| Gesture | How to draw it | What happens |
|---|---|---|
| **Underline** | Long, flat horizontal stroke under a word | AI defines or explains the underlined term in context |
| **Box** | Closed loop (square, circle, or rough shape) around content | AI solves the equation or explains the boxed concept step-by-step |

When a gesture is detected, the stroke turns **red** (underline) or **blue** (box) to confirm recognition, and a response card appears next to it on the canvas.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Canvas | tldraw 4 |
| AI providers | Google Gemini, OpenAI, Anthropic |
| Local storage | Dexie (IndexedDB) |
| Styling | Tailwind CSS 4 |
| Markdown | react-markdown + remark-gfm |

---

## Project Structure

```
noted/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing
│   ├── backpack/page.tsx   # Notebook library
│   └── notebook/[id]/      # Canvas workspace
├── components/             # AIResponseShape, SettingsModal, ConfirmModal
├── hooks/                  # useAIGesture
└── lib/                    # db.ts (Dexie), aiService.ts
```

---

## License

MIT
