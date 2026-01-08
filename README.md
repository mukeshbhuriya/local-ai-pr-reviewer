# AI PR Reviewer & Code Generator 🚀

An autonomous AI agent that generates production-ready code and reviews Pull Requests with senior-level insight. built as a 1-day MVP.

## Features

-   **Code Generation**: Generates full backend modules (Controller, Service, Routes) from a simple feature description.
-   **AI PR Review**: Automatically analyzes PR diffs and posts structured, actionable comments (Blocker, Warning, Suggestion).
-   **GitHub Integration**: CI/CD workflow included to trigger reviews on every PR.
-   **Customizable Functionality**: Uses OpenAI/Anthropic (via adapter) for intelligence.

## Architecture

# local-ai-pr-reviewer 🤖🔍

AI-powered pull request reviewer that runs **entirely locally** using LLMs (via Ollama), integrates with **GitHub Actions**, and posts **inline, security-focused code review comments** directly on pull requests.

No OpenAI. No cloud inference. No data leaves your infrastructure.

---

## ✨ Features

- 🤖 **Automated AI PR reviews**
- 🔒 **Local-only inference** (Ollama + LLMs like Llama 3)
- 💬 **Inline comments on exact lines changed**
- 🧠 **Security & logic bug detection**
- ⚙️ **Runs in GitHub Actions**
- 💸 **Zero cloud or API costs**
- 🔑 **Secure API key authentication**
- 🧩 Language-agnostic (JS, TS, Python, Go, etc.)

---

## 🏗️ Architecture Overview

```ascii
GitHub PR
   ↓
.github/workflows/ai-pr-review.yml
   ↓
(POST /review-pr)
   ↓
[AI Review Service (Node.js/Express)]
   ↓
[LLM Adapter (OpenAI)]
   ↓
Structured Review JSON
   ↓
GitHub API (Post Comments)
```

## Setup

1.  **Clone & Install**
    ```bash
    git clone https://github.com/mukeshbhuriya/local-ai-pr-reviewer
    cd AI
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file:
    ```env
    PORT=3000
    OPENAI_API_KEY=sk-...
    ```

3.  **Run Locally**
    ```bash
    npm run dev
    ```

## Usage

### 1. Code Generation
**Endpoint:** `POST /generate-code`

```bash
curl -X POST http://localhost:3000/generate-code \
  -H "Content-Type: application/json" \
  -d '{
    "feature": "User Authentication",
    "stack": "Node.js + Express",
    "constraints": ["JWT", "bcrypt", "input validation"]
  }'
```

### 2. PR Review (Simulation)
**Endpoint:** `POST /review-pr`

```bash
curl -X POST http://localhost:3000/review-pr \
  -H "Content-Type: application/json" \
  -d '{
    "repo": "user/repo",
    "prNumber": 101,
    "diff": "diff --git a/src/server.ts b/src/server.ts\nindex 8234...\n--- a/src/server.ts\n+++ b/src/server.ts\n@@ -10,6 +10,7 @@\n+ const secret = \"HACODED_SECRET\"; // SECURITY RISK"
  }'
```

## GitHub Action Setup

1.  Deploy this service to a public URL (e.g., via Vercel, Render, or ngrok for testing).
2.  Add `AI_REVIEW_API_URL` to your GitHub Repository Secrets (e.g., `https://your-app.com/review-pr`).
3.  Add `APP_API_KEY` to your GitHub Repository Secrets (must match the key involved in your server .env).
4.  Add `OPENAI_API_KEY` to your **deployed server's** environment variables.
5.  The workflow in `.github/workflows/ai-pr-review.yml` will automatically run on PRs.

## Known Limitations (MVP)

-   **Context Limit**: Very large diffs may hit LLM token limits (need chunking strategy).
-   **Mock Mode**: Defaults to mock response if no API key is provided.
-   **Line Mapping**: GitHub API requires precise diff positions; accurate mapping from "Line 42" to "Diff Position" is complex and simplified here.

## Future Improvements

-   [ ] Implement diff chunking for large PRs.
-   [ ] Support for multiple files context (Repo Map).
-   [ ] Webhook integration for real-time chat with the bot.
