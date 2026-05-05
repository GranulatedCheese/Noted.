# Noted.

**AI-powered Notebook for students.**

Noted. is a modern, high-performance canvas application built with **tldraw**. It bridges the gap between freeform handwriting and computational intelligence. By recognizing natural gestures like boxes and underlines, Noted. allows users to query AI models directly from their sketches to solve equations, define terms, or explain complex concepts.

---

## ✨ Features

- **Markup Intelligence**: Draw a box to solve equations or an underline to define terms.
- **Spatial Context**: AI responses appear as persistent, styled shapes directly next to your notes.

---

## 🚀 Getting Started Locally

Follow these steps to get your development environment running.

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm**

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
