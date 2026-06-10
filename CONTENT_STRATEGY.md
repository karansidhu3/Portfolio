# CONTENT_STRATEGY.md — Content & Copy Strategy

> This document governs all written content across the portfolio.
> The writing has a voice. It is specific. It is honest.
> Every word earns its place or it is removed.

---

## 1. WRITING TONE

### 1.1 The Voice

The writing voice throughout this portfolio is:

**Precise, not academic.** Clarity is the highest priority. Sentences say exactly what they mean in the minimum words required. There are no filler phrases ("I am passionate about..."), no hedging where confidence is warranted, and no technical jargon used to impress rather than communicate.

**Direct, not curt.** The voice is confident and economical, but not cold. There is warmth in the specificity — the writing sounds like someone who cares enough about the reader to think carefully about what they need to know.

**Specific, not generic.** Every claim has a specific anchor. Not "I build performant systems" but "I built a real-time ingestion pipeline that processes 10,000 documents per hour using a three-stage filtering system." The specificity is what makes writing credible.

**Honest, not self-promotional.** The tone does not claim superlatives ("best", "world-class", "exceptional"). It describes what was built, what was learned, and what would be done differently. The honesty is itself the differentiator.

### 1.2 What the Voice Is Not

```
NOT: "I craft impactful digital experiences that drive real results."
NOT: "Passionate engineer committed to excellence in every project."
NOT: "Full-stack developer with 5+ years of experience building scalable..."
NOT: "I help businesses grow through innovative technical solutions."
```

These constructions are invisible. They communicate nothing because they could describe anyone. The writing in this portfolio communicates things only Karan could write.

### 1.3 Registers by Section

Different sections use the voice in different registers:

| Section | Register | Example |
|---|---|---|
| Hero | Atmospheric / declarative | "Software that thinks. Systems that compound." |
| Signal | Philosophical / precise | "The work I'm most interested in lives at the boundary of engineering and intelligence." |
| Project problem | Narrative / honest | "Market signal is a ratio problem, not a data problem. Everyone has the data." |
| Technical insights | Concise / specific | "Embedding similarity outperformed keyword matching by 40% on recall across test corpus." |
| About | Personal / grounded | "I graduated from UBC in 2026 with a CS degree and a data science minor. Before that, I was building things to learn things." |
| Contact | Open / practical | "I'm looking for a role where I can work on AI systems that matter. If that sounds like what you're building, I'd like to talk." |

---

## 2. HEADLINE PHILOSOPHY

### 2.1 What a Headline Does in This Portfolio

Headlines are not labels. A headline that says "Projects" tells the visitor nothing they don't already know. A headline that says "Systems I've built and what I learned building them" tells them how to read what follows.

In this design system, headlines operate at two levels:
1. **Atmospheric headlines** — large, cinematic, read at a glance. These communicate feeling and orientation.
2. **Structural headlines** — medium scale, read carefully. These communicate specific meaning.

### 2.2 Atmospheric Headline Rules

- Must be readable in < 3 seconds (short)
- Must be specific enough to be interesting (not just beautiful)
- Should create curiosity, not provide answers
- Test: could anyone else have written this? If yes, rewrite.

**Good atmospheric headlines:**
- "Systems built at the edge of what's currently possible."
- "The signal problem in a world of noise."
- "Software that learns from what it's given."

**Bad atmospheric headlines:**
- "Work" (label, not headline)
- "Building the future of AI" (cliché)
- "Projects" (see above)
- "Crafting elegant digital solutions" (empty)

### 2.3 Structural Headline Rules

- Must be specific to the section's content
- Can be slightly longer (up to 12 words)
- Should tell the reader exactly what they're about to read
- Can use a noun phrase instead of a full sentence

---

## 3. PROJECT STORYTELLING

### 3.1 The Case Study Model (Adapted)

Each project narrative follows an implicit five-part structure. These parts don't need headers — they flow as connected prose or structured sections.

**Part 1: The Real Problem**
Not "I built a market sentiment tool." The actual problem worth solving.

*What to write:* The observation or insight that motivated the project. Why this problem mattered. What the existing state of things was before.

*Example (MarketMind):*
"Market intelligence at scale is a noise problem, not a data problem. The data already exists — thousands of news sources, earnings calls, analyst notes updated continuously. The challenge is that 90% of it is irrelevant to any given position at any given moment. Most tools solve this with keyword filters. I built something that understands relevance instead."

**Part 2: The Approach (Non-Obvious Choices)**
The decisions that weren't obvious. The things tried and abandoned. The moment where the easy path was rejected.

*What to write:* The key architectural or product decision and the reasoning behind it. Be specific about the tradeoff.

*Example:*
"The first version used TF-IDF scoring against a curated keyword list. It worked, but the precision was wrong — catching too many irrelevant mentions, missing too many relevant ones. Switching to embedding-based similarity scoring required rebuilding the ingestion pipeline but produced a recall improvement that made the difference between useful and noise."

**Part 3: What Was Built**
The system, described precisely. What it does, how it works, what's interesting about it technically.

*What to write:* The system's components, the key technical implementation choices, and what makes this implementation worth understanding. This is where the architecture diagram lives.

**Part 4: Engineering Insights** (3–5 specific observations)
The most interesting things discovered during implementation. These are not summaries of the project — they are specific, transferable insights.

*Format:*
```
"1. Temporal weighting of news articles (exponential decay over 72h) 
   reduced noise by ~30% without meaningfully affecting recall."
```

*Anti-pattern:*
```
"1. I learned the importance of good architecture." (Not specific, not useful)
```

**Part 5: Honest Reflection**
What would be done differently. What was learned. What's missing or imperfect.

*Why this matters:* Honest reflection is more credible than purely positive retrospectives. It demonstrates judgment — the ability to evaluate one's own work objectively.

*Example:*
"The embedding model is the weakest point. I used a general-purpose model where a finance-domain fine-tune would perform measurably better. This is the next improvement — building a fine-tuning dataset from the existing corpus."

---

## 4. TECHNICAL EXPLANATION STYLE

### 4.1 Explaining Complex Things

The goal is clarity, not simplification. Technical depth should be present — but presented in a way that both technical and non-technical readers can extract value from.

**The two-layer approach:** Each technical section has a surface layer (readable by anyone) and a depth layer (detailed enough for engineers).

Surface layer example:
> "The system ingests market news in real time and ranks it by relevance to a given portfolio."

Depth layer example:
> "Ingestion: RSS feeds + Adzuna API polling → embedding via text-embedding-3-small → cosine similarity against portfolio holding embeddings. Relevance score = similarity × recency_weight (τ = 24h)."

The surface layer comes first. The depth layer is in the engineering insights section.

### 4.2 Technology Mentions

Technology names should appear in context, not as a list of credentials. The goal is to communicate *why* a technology was chosen, not simply that it was used.

**Wrong:** "Built with FastAPI, Next.js, PostgreSQL, Redis, and OpenAI."

**Right:** "FastAPI handles the ingestion and embedding API — it was the right balance of performance and async support. PostgreSQL with pg_vector extension for similarity search, which avoided adding a dedicated vector database for the current scale."

### 4.3 What Not to Explain

Do not explain standard tools or commonly understood technologies. The reader is assumed to be technical. Explaining what React is, or how REST APIs work, wastes their time and suggests under-estimation.

Only explain the specific, non-obvious choices made in this project.

---

## 5. NARRATIVE SEQUENCING

### 5.1 The Page as a Single Argument

Every piece of content on the page contributes to one central argument. The sequence matters: each section should feel like the natural next thing after what came before.

```
Hero:      This is someone who builds at a high level.
Signal:    Here is their specific orientation and philosophy.
Project 1: Here is evidence — deep, technical, honest.
Project 2: More evidence — different domain, same quality of thinking.
Project 3: More evidence — the pattern is established.
About:     Here is who this person actually is.
Contact:   Here is how to talk to them.
```

The visitor who reads in sequence should feel a building sense of "I want to work with this person" — not an immediate wow followed by a slow decline.

### 5.2 Copy Length Philosophy

**Different sections warrant different density.**

```
Hero:           5–15 words total on screen at any moment
Signal:         30–60 words (the most important paragraph)
Project problem: 40–80 words
Tech insights:   15–30 words each, 3–5 total per project
About:           100–200 words total across sub-sections
Contact:         20–40 words
```

**Rule:** If a section feels too long, cut in half. Read it again. If it still feels too long, cut again. The right length is the shortest version that communicates everything necessary.

### 5.3 The Scannability / Depth Balance

The site must work for both types of readers:
1. **The scanner** — scrolling quickly, looking for pattern recognition. Should be able to understand the key claims within 30 seconds.
2. **The reader** — moving through carefully, evaluating in depth. Should be rewarded for the time with specific, interesting content.

This is achieved by structural hierarchy:
- Large headlines → scanners get the summary
- Supporting paragraphs → readers get the depth
- Engineering insights → rewarded depth for technical readers

---

## 6. SYSTEMS STORYTELLING

### 6.1 Making Systems Legible

The portfolio's unique angle is making complex system thinking visible and accessible. The challenge: systems are abstract; stories are concrete.

**The technique:** Narrate the system through its moments of decision. Instead of describing what the system does (abstract), describe the moment where a key architectural decision was made (concrete).

**Abstract (wrong):** "The system uses a three-stage pipeline to process documents."

**Concrete (right):** "Documents arrive as raw text. Stage one filters by metadata (publication date, source credibility). Stage two runs the embedding model. Stage three does similarity ranking — and this ordering matters: running embedding on pre-filtered documents costs ~70% less compute than the reverse."

### 6.2 The Architecture Diagram as Prose

Architecture diagrams should complement — not replace — prose explanations. The diagram shows the shape of the system. The prose explains the reasoning.

Every diagram should have:
- A brief preceding sentence explaining what the diagram shows
- Labels that are complete English phrases, not abbreviations
- A following sentence noting the most important thing in the diagram

### 6.3 Data and Numbers

Specific numbers are infinitely more credible than qualitative claims.

**Vague:** "The system handles large volumes of data efficiently."

**Specific:** "Processing 10,000 documents per hour with < 200ms p99 embedding latency."

Use numbers when you have them. When you don't have exact numbers, describe the qualitative outcome precisely instead of inventing figures. "Measurably faster" is worse than "10× faster" but better than claiming "10× faster" without proof.

---

## 7. COPY ANTI-PATTERNS

These specific constructions are prohibited in all portfolio copy:

```
PROHIBITED PHRASES:
"passionate about"           — vague, universal, meaningless
"I love to"                  — same
"drive results"              — marketing-speak
"impactful"                  — overused buzzword
"leverage" (as a verb)       — corporate-speak
"scalable solution"          — implies you build unscalable things otherwise
"innovative"                 — if you have to say it, it isn't
"full-stack developer"       — label, not identity
"seeking opportunities to"   — passive and generic
"I have a strong passion for" — maximum avoid
"exceed expectations"        — expectations of whom?
"I thrive in"               — performance review language

STRUCTURAL ANTI-PATTERNS:
Opening with a job title definition ("Software engineer with X years...")
Lists of technology logos without context
Bullet points in the narrative sections
Ending project descriptions with "This was a great learning experience"
Vague calls to action ("Let's connect!")
Any claim that could be on anyone else's portfolio verbatim
```

---

## 8. WRITING PROCESS RECOMMENDATIONS

### 8.1 Write Drafts in Plain Text

Write all portfolio copy in a plain text document first. No design, no layout constraints. The writing should work as writing before it gets placed in the design.

### 8.2 The Read-Aloud Test

Every section of copy should be read aloud before it's finalized. If you stumble on a sentence, it's not yet the right sentence. If it sounds impressive but vague when spoken, rewrite it. Writing that sounds good aloud almost always reads well.

### 8.3 The Specificity Audit

For every paragraph, ask: "What specific, concrete detail is in this paragraph?"

If the answer is "none," the paragraph is probably filler. Add a specific detail or remove the paragraph.

### 8.4 The Stranger Test

Share each section with someone who doesn't know the project. Ask them: "What do you understand about what this system does and why it was built?" If they can't answer accurately, the writing has failed — not the reader.

---

*Writing quality is half the portfolio.*
*An excellent design with weak copy is a half-finished portfolio.*
*The words are not secondary to the visuals — they are the substance the visuals serve.*
