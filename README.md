# Noted.

**The AI-integrated canvas for the quantitative thinker.**

Noted. is a modern, high-performance canvas application built with **tldraw**. It bridges the gap between freeform handwriting and computational intelligence. By recognizing natural gestures like boxes and underlines, Noted. allows users to query AI models directly from their sketches to solve equations, define terms, or explain complex concepts.

---

## ✨ Features

- **Gestural Intelligence**: Draw a "sloppy" box to solve equations or an underline to define terms.
- **Spatial Context**: AI responses appear as persistent, styled shapes directly next to your notes.
- **Quantitative Focus**: Built for CS, Physics, and Quant Finance workflows.
- **Local-First**: Fast, responsive canvas with persistent page management and local storage security.

---

## 🚀 Getting Started Locally

Follow these steps to get your development environment running.

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **pnpm**

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/GranulatedCheese/Noted.
   cd noted
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Install the AI SDK**:

   ```bash
   npm install @google/generative-ai
   ```

4. **Start the development server**:

   ```bash
   npm run dev
   ```

5. **Open the app**: Navigate to `http://localhost:5173` in your browser.

---

## 🔑 Adding Your API Key

To enable AI gesture recognition, you must provide a Gemini API Key. Noted. stores this key locally in your browser's `localStorage` — it is never sent to a backend server.

1. **Get a Key**: Visit [Google AI Studio](https://aistudio.google.com) and generate a free API key for Gemini.
2. **Open Settings**: In the Noted. app, navigate to your Settings or Backpack panel.
3. **Enter Key**: Paste your key into the field labeled **Gemini API Key**.
4. **Save**: The key is saved instantly. You can now use gesture triggers on the canvas.

> **Note:** Using an API key can cost money and credits. Please ensure you have that all figured out first. This program is still in development so bugs can occur. It is NOT my fault if an unexpected amount of credits are used. Use program with caution!

---

## 🖋️ How to Use AI Gestures

| Gesture       | Action                                                                              | Result                                                             |
| ------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **Box**       | Draw a closed loop (square, circle, or messy box) around a math problem or concept. | Gemini solves the equation or explains the concept in a blue note. |
| **Underline** | Draw a long, flat line under a specific word or phrase.                             | Gemini provides a concise definition of the underlined text.       |

---

## 🛠️ Tech Stack

| Layer         | Technology     |
| ------------- | -------------- |
| Framework     | React + Vite   |
| Canvas Engine | tldraw         |
| AI Model      | Gemini 3 Flash |
| Styling       | Tailwind CSS   |

---

## 📝 License

This project is for educational and personal productivity use.
