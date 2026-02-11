## SynIQ — AI-Powered Personal Knowledge Twin

SynIQ is an intelligent second-brain system designed to help professionals retain, organize, and retrieve knowledge from lectures, documents, and conversations.

It acts as a persistent AI memory layer that evolves with the user — turning scattered information into structured, searchable intelligence.

⚠️ Status: Work in Progress
This project is actively being developed and is currently hosted on Vercel, but isn't functional due to API limits

## Core Features (Current MVP)
1. Document Upload & Processing
Upload TXT and PPT files
Automatic text extraction
Intelligent chunking system
Stored locally for semantic retrieval

2. Semantic Query System
Keyword-based retrieval
Context-aware answering using Google Gemini
Source highlighting with relevance scoring

3. Lecture Recording
Live speech-to-text using Web Speech API
Real-time transcription preview
Converts transcript into structured notes via AI

4. AI Note Generation
Converts raw transcript into:
Headings
Bullet points
Definitions
Examples

5. Document Management Dashboard
View uploaded files
Download documents
Delete documents
Minimalistic light/dark UI

Tech Stack

Frontend
Next.js 15 (App Router)
TypeScript
Tailwind CSS
ShadCN UI
Sonner (toast notifications)

Backend

Next.js API Routes
Node.js file system storage
Google Gemini API for AI reasoning

AI Architecture
Multi-agent architecture (conceptual layer)
Retrieval-based answering
AI-driven summarization and restructuring

Hosting
Vercel

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

