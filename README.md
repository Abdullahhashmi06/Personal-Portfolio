# Abdullah Hashmi — Portfolio

A personal portfolio website built with Next.js, featuring an AI-powered RAG chatbot for answering questions about Abdullah's projects, skills, and experience.

## Architecture

### Portfolio
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Animations**: motion/react (Framer Motion)
- **Fonts**: Geist Sans + Mono

### AI Chatbot (RAG System)
```
VISITOR → CHATBOT UI → /api/chat → INPUT VALIDATION → RATE LIMIT
    → QUERY EMBEDDING → SUPABASE PGVECTOR → TOP-K RETRIEVAL
    → RELEVANT CONTEXT → RAG SYSTEM PROMPT → GROQ PRIMARY
    → (fallback) OPENROUTER → ANSWER
```

- **Vector Database**: Supabase with pgvector
- **Embeddings**: all-MiniLM-L6-v2 (384 dimensions, local via HuggingFace Transformers)
- **Primary LLM**: Groq (llama-3.3-70b-versatile)
- **Fallback LLM**: OpenRouter (configurable, defaults to llama-3.3-70b-instruct:free)

## Supabase Setup

### 1. Create a Supabase Project
Go to [supabase.com](https://supabase.com) and create a free project.

### 2. Run the Schema SQL
Go to **SQL Editor** in your Supabase dashboard and run the contents of `supabase/schema.sql`. This creates:
- `pgvector` extension
- `documents` table
- `document_chunks` table with vector embeddings
- Similarity search function (`similarity_search`)
- Indexes for fast retrieval

### 3. Get Your Keys
Go to **Settings → API** and copy:
- `Project URL` → `SUPABASE_URL`
- `anon public` key → `SUPABASE_ANON_KEY`
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
# Contact Form
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
CONTACT_EMAIL=

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=

# AI Chatbot — Groq (Primary)
GROQ_API_KEY=          # https://console.groq.com
GROQ_MODEL=llama-3.3-70b-versatile

# AI Chatbot — OpenRouter (Fallback)
OPENROUTER_API_KEY=    # https://openrouter.ai
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free

# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

**Never commit `.env.local`.**

## Knowledge Base Ingestion

The ingestion script reads portfolio data from the existing codebase and stores it in Supabase with embeddings.

### Run Ingestion

```bash
# Make sure environment variables are set
npm run ingest
```

This processes:
- CV/resume information
- About section
- InternIQ project data + case study
- MLP project data
- Image Filtering project data
- Skills & technologies
- Social links

### Adding New Documents

To add new content (e.g., a new CV version or project):

1. Edit `scripts/ingest-knowledge.mjs` → `getPortfolioDocuments()` function
2. Add a new document object with `title`, `source`, `content`, and `metadata`
3. Run `npm run ingest` again (idempotent — updates existing documents)

## Running Locally

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your keys

# Ingest the knowledge base (one-time setup)
npm run ingest

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How Groq Works

Groq is the primary LLM provider. It provides fast inference for the chatbot.

1. User sends a message
2. The message is embedded using all-MiniLM-L6-v2
3. Relevant context is retrieved from Supabase pgvector
4. The system prompt + context + conversation history are sent to Groq
5. Groq generates and returns the response

## How OpenRouter Fallback Works

OpenRouter is the secondary/fallback provider. It activates when:

- Groq returns HTTP 429 (rate limited)
- Groq returns HTTP 5xx (server error)
- Groq times out (15 seconds)
- Groq is temporarily unavailable

The fallback is automatic and transparent to the user.

### Testing Fallback (Development Only)

To test the Groq → OpenRouter fallback without waiting for Groq to actually fail:

```bash
# In your .env.local (development only!)
GROQ_FORCE_FAIL=true
```

This forces Groq to fail immediately, triggering OpenRouter. **Never set this in production.**

## Deploying to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add all environment variables in **Settings → Environment Variables**
4. Deploy

The chatbot works on Vercel's serverless functions. No persistent processes needed.

**Important for Supabase on Vercel:**
- The Supabase URL and keys must be set in Vercel's environment variables
- The ingestion script should be run locally or in a CI/CD pipeline, not on Vercel

## Updating the Knowledge Base

When CV or portfolio content changes:

1. Update the relevant data files (`src/data/projects.ts`, `src/data/site.ts`, etc.)
2. Update `scripts/ingest-knowledge.mjs` if needed
3. Run `npm run ingest` locally
4. Deploy to Vercel

## Security Notes

- **Never expose** `SUPABASE_SERVICE_ROLE_KEY`, `GROQ_API_KEY`, or `OPENROUTER_API_KEY` to the client
- The chatbot API validates all inputs server-side
- Rate limiting is enforced per IP (15 requests/minute)
- Messages are limited to 1000 characters
- Conversation history is limited to 12 messages
- The system prompt prevents prompt injection and information leakage
- `CONTACT_EMAIL` is never exposed through the chatbot

## Project Structure

```
src/
  app/
    api/
      chat/route.ts          # Chat API endpoint
      contact/route.ts       # Contact form API
    contact/page.tsx          # Contact page
    work/                     # Case study pages
  components/
    chatbot/                  # Chatbot UI components
      Chatbot.tsx             # Main component
      ChatbotButton.tsx       # Floating launcher
      ChatbotPanel.tsx        # Chat panel
      ChatMessage.tsx         # Message bubbles
      ChatInput.tsx           # Input field
      SuggestedQuestions.tsx   # Question chips
      TypingIndicator.tsx     # Loading animation
    ui/                       # Shared UI components
  lib/
    ai/
      provider.ts             # LLM abstraction (Groq + OpenRouter)
      prompts.ts              # System prompt & message building
      rate-limit.ts           # Rate limiting
    rag/
      chunking.ts             # Text chunking
      embeddings.ts           # Embedding generation
      retrieval.ts            # Vector search & context building
    supabase/
      server.ts               # Supabase server client
  data/                       # Portfolio data (projects, site, etc.)

scripts/
  ingest-knowledge.mjs        # Knowledge base ingestion script

supabase/
  schema.sql                  # Database schema
```

## Limitations

- The embedding model (all-MiniLM-L6-v2) is optimized for English text
- The knowledge base is relatively small (portfolio content only)
- Conversation history is kept client-side and limited to recent messages
- The rate limiter is in-memory (resets between serverless function invocations on Vercel)

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, motion/react
- **Backend**: Next.js API Routes, Supabase, pgvector
- **AI**: Groq, OpenRouter, HuggingFace Transformers
- **Database**: PostgreSQL (Supabase) with pgvector
- **Deployment**: Vercel
