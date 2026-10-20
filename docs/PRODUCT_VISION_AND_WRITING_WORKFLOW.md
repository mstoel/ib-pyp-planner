# Product Vision: PYP Learning, Planning and Writing System

**Status:** Core product decision — agreed 20 October 2026  
**Initial audience:** Personal use, with planning initially focused on Years 3–6  
**Repository:** `mstoel/ib-pyp-planner`

## The central idea

The application must do more than explain the Primary Years Programme (PYP) or provide a template. It must actively help the user **learn, write, revise and finish real unit plans** while building the user's professional understanding and judgement.

The product is a personal PYP development system that connects three activities:

1. **Learn** — understand PYP principles, examine examples, practise decisions and develop professional judgement.
2. **Design and teach** — design inquiries and units, plan learning experiences, assess learning, and record what actually happens.
3. **Improve** — reflect on evidence, review decisions, identify gaps and improve future planning.

A successful system helps the user understand why a plan is coherent and how it can improve—not merely produce a document that looks professional.

## Essential requirement: the AI must help write the unit

The application must not leave the user with a blank template and general advice. The AI should be an active, collaborative co-writer that can draft meaningful sections and help turn a rough idea into a complete, editable unit plan.

The user does not need to know all PYP terminology before starting. They may begin with a rough idea, an existing plan, an uploaded document, or a plain-language description of what they want students to learn.

### Two ways to start

- **Guided creation:** Develop a unit step by step, with explanations, examples, questions and feedback. This mode is especially useful while learning the PYP.
- **Fast creation:** Describe the idea and ask the AI to produce a first draft. The user can then review and improve the sections that need attention.

The user may move between these approaches at any time. They should not have to complete every field before making progress.

## Collaborative writing workflow

1. **Capture the idea.** Accept plain language, notes, an existing unit plan or an uploaded document. Help identify what is known and what still needs a decision.
2. **Develop the inquiry.** Work with the user on the transdisciplinary context, central idea, lines of inquiry, relevant concepts, student questions and prior understanding. Explain terminology when useful.
3. **Draft the unit.** Generate editable draft content for the relevant sections, including possible learning experiences, subject-specific knowledge and skills that contribute meaningfully, assessment evidence, student agency and possible action.
4. **Check coherence.** Review relationships across the unit, not just whether fields are filled in. Explain issues and offer concrete revisions.
5. **Revise collaboratively.** Let the user accept, edit, reject or regenerate suggestions. Never silently replace user-authored content. Preserve earlier versions and make changes traceable.
6. **Prepare for teaching.** Help expand the unit into learning sequences or individual lesson plans and create related resources or assessment materials where requested.
7. **Reflect and improve.** After teaching, record what was planned, what happened, evidence of student learning, student questions, changes made and implications for next time.
8. **Export the finished work.** Produce a polished, printable unit plan or selected sections, with editable Word and PDF outputs as supported by the implementation.

## Three AI working modes

These are modes of working within one connected application, not separate products.

### Teach me
Explain PYP ideas in accessible language, compare examples, ask useful questions and help the user develop their own understanding.

### Help me write
Co-create unit plans and their component sections. Offer first drafts, alternative wording, learning experiences, assessment ideas and resources. The user remains the author and decision-maker.

### Review my work
Critically examine an existing plan, explain strengths and weaknesses, identify incoherence and recommend specific improvements. Feedback should distinguish essential concerns from optional suggestions.

The user may switch modes during any workflow.

## Coherence and quality review

The AI should check the relationships between the parts of a unit. For example:

- Do the central idea and lines of inquiry create a meaningful and investigable direction?
- Do learning experiences help students explore the intended inquiry?
- Are subject connections authentic and useful, rather than added to satisfy a checklist?
- Does assessment produce evidence relevant to the intended understanding?
- Are voice, choice and ownership meaningfully supported?
- Is possible student action connected to learning rather than appended as a decorative activity?
- Can the plan adapt when student questions and evidence lead the inquiry in an unexpected direction?
- Are learning intentions, success criteria and assessment methods understandable and appropriate for the learners?

Feedback must explain its reasoning and offer practical alternatives. The checker is a professional support tool, **not an official IB approval, compliance certification or guarantee**.

## Trust and source handling

The application must clearly distinguish:

1. Verified IB framework information, with source links and dates where available.
2. School-specific requirements and decisions entered by the user.
3. General pedagogical recommendations and illustrative examples generated by the system.

The AI must not present a recommendation as an official IB requirement without evidence. It should acknowledge uncertainty and gaps in source access. Prefer links and original explanations over reproducing copyrighted IB publications.

## Connected curriculum and unit planning

The application must support both:

- A wider Programme of Inquiry view, including units across Years 3–6 and connections across the six transdisciplinary themes.
- Individual unit planning and standalone subject projects.

The system should help the user examine conceptual connections, progression, balance and possible repetition across units without imposing a single rigid sequence on every school.

Transdisciplinary planning must not be reduced to assigning a subject label to every lesson. Subject knowledge and skills should be included when they contribute meaningfully to the inquiry, and explicit subject teaching remains possible when appropriate.

## Product principles

- **Useful writing over empty forms:** help the user make progress even when their initial idea is incomplete.
- **Learning through doing:** explain decisions in context instead of separating all learning into a theory course.
- **User ownership:** all AI content is editable; the user chooses what to accept.
- **Transparent revisions:** retain version history and distinguish intended plans from actual teaching and reflection.
- **Coherence over checkbox completion:** judge the quality of relationships, not the number of completed fields.
- **Flexible inquiry:** support emergent student thinking and justified changes to the plan.
- **Persistent storage:** save projects and resources in a database with appropriate access controls; browser-only storage must not be the sole source of truth.
- **Professional output:** generate clear, well-structured, printable documents without making the workflow depend on export formatting.
- **Start small, design to grow:** first validate the full workflow with one complete example unit, while designing the data model to support broader programme-level planning.

## First prototype acceptance criteria

The first end-to-end prototype should let the user:

- Start from a plain-language idea or choose guided creation.
- Receive AI help to develop and draft a complete unit.
- Edit the generated content directly.
- Ask for explanations, drafting help or critical review at any point.
- See actionable coherence feedback with reasoning.
- Save the project persistently and reopen it later.
- Preserve revisions rather than silently overwriting work.
- Export a professional unit document.
- Record a reflection on what happened and what should change next time.

The prototype should be evaluated by asking: **Does this system help the user both finish a real unit plan and better understand the reasoning behind it?**

## Agreed direction

The PYP Planner is not merely a planner with AI features. It is a connected system for **professional learning, collaborative writing, inquiry design, classroom practice and continuous improvement**. The AI must be able to teach, draft, critique and revise—not just offer advice.
