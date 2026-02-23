# DevGrade 🚀

![DevGrade Preview](public/preview-placeholder.png) <!-- Update with actual screenshot later -->

DevGrade is a modern, responsive **GitHub Portfolio Analyzer** built with Next.js. It evaluates a developer's engineering health by analyzing repository data, commit velocity, code complexity, and security practices, ultimately generating a personalized roadmap using **Google's Gemini AI**.

## ✨ Features

- **Live GitHub Ingestion:** Fetches real-time profile, repository, and commit data utilizing the GitHub REST API.
- **Advanced Scoring Heuristics:** Calculates customized scores for **Project Quality**, **Tech Diversity**, **Documentation**, and **Security**.
- **AI Engineering Roadmap:** Dynamically generates actionable career and technical advice tailored to your specific repository metrics using **Gemini 2.5 Flash**.
- **Visual Analytics:** Beautiful, interactive Radar Charts powered by Recharts.
- **Sleek Aesthetic:** Minimalist dark-mode UI with smooth entry animations powered by Tailwind CSS and Framer Motion.
- **Production Ready:** Fully tested with unit (Jest) and End-to-End (Playwright) testing suites.

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, React 19)
- **Styling:** Tailwind CSS v4, `clsx`, `tailwind-merge`
- **Animations & Icons:** Framer Motion, Lucide React
- **Data Visualization:** Recharts
- **AI Integration:** `@google/genai` (Gemini API)
- **Testing:** Jest, React Testing Library, Playwright E2E

## 🚀 Getting Started

### 1. Requirements
Ensure you have Node.js (v18+) installed.

### 2. Environment Variables
Create a `.env.local` file at the root of the project and add your API keys:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GITHUB_TOKEN=your_github_personal_access_token_here
```
*(Note: Generate your GitHub token from [Developer Settings](https://github.com/settings/tokens) with `public_repo` and `read:user` access. Generate your Gemini API Key from [Google AI Studio](https://aistudio.google.com/).)*

### 3. Installation & Run

Install the dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result!

## 🧪 Testing

Run unit & component tests (Jest):
```bash
npm run test
```

Run End-to-End tests (Playwright):
```bash
npx playwright install # First time only
npm run test:e2e
```

## 📄 License
© 2024 DevGrade Engineering. All rights reserved.
