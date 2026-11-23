# Vocab Gym — Handoff Document

## What This Is

A web-based vocabulary learning tool designed for **live, coached classroom sessions**. Students work through vocabulary words using a structured pedagogical method while a facilitator monitors progress in real time. The platform runs embedded inside virtual classroom environments (currently Gather.town) and must also work in Zoom-style screen-share contexts.

The long-term vision is a library of **500+ high-frequency SAT words**, each with a premium visual asset (image or short video) that encodes the word's meaning through imagery rather than text.

---

## The Pedagogical Core

Each word should be encountered through escalating stages of cognitive effort, not just presented once and moved on from. The sequence matters: a student should have to *reach* for a word before they are given it, *see* it in a meaningful context before they are asked to use it, and *use* it in their own voice before they are asked to defend it.

The underlying principles, in order of application:

- **Retrieval under uncertainty** — Before the word is revealed, the student should be forced to guess or reach. Difficulty at this stage is intentional. Not knowing the answer and having to search for it creates a stronger memory trace than reading a definition cold.

- **Vivid encoding** — The word's meaning should be shown, not just stated. A striking image or scene that *embodies* the concept lodges it in memory in a way a dictionary definition cannot. The emotional and visual impression is the point.

- **Generative output** — The student must produce something — a definition, a sentence, an explanation in their own words. Passive recognition is not the goal. Generating output forces the brain to consolidate what it just encoded.

- **Error correction** — The student should encounter a plausible mistake about the word and be asked to fix it. Identifying and correcting a wrong answer is one of the most durable consolidation techniques known. It requires holding the correct meaning firmly enough to compare it against something wrong.

**The through-line:** Every interaction should require the student to do something, not just see something. Passive exposure is not learning. The experience should feel like effort.

---

## The Session Model

Sessions are facilitated live with a coach. The target block is approximately **15 minutes of active practice** covering a set of 5 words ("bundle"). Students and coach are in the same virtual room.

- **Student experience**: Enter an ID, work through the word bundle at their own pace within the time block, get confirmation when done.
- **Facilitator experience**: See who has completed which words in real time, without disrupting students.

The system needs to support **~20 concurrent students** per session.

---

## Visual Assets

Visual assets are the **core differentiator** for memory encoding. A student who encounters a word through a striking, well-chosen image encodes it differently than one who reads a definition. Asset quality is not a production detail — it is central to whether the method works.

Each word should be paired with imagery that *embodies* its meaning rather than illustrating it literally. The goal is an emotional and conceptual impression that sticks.

---

## What Needs to Be Tracked

The system needs to know, at minimum, how far each student has gotten — in real time, during a live session. Beyond that, there is a longer-term goal: understanding which words a given student consistently struggles with, so future sessions can be weighted toward their actual gaps rather than treating every student the same.

How that tracking is implemented, and how personalization is surfaced, is an open design problem.

---


## What the Current Implementation Got Wrong

The existing codebase became too complex — too many moving parts for what is fundamentally a simple interaction. The complexity crept in from trying to solve too many problems at once.

**Start fresh with this principle:** A student in the middle of a live session should never feel confused about what they're supposed to do next. Every screen has one job.

---

## Open Design Questions for the New Implementation

- How should the session timer (if any) be surfaced to the student without creating anxiety?
- What is the right recovery path when a student's definition attempt is rejected? How many tries before showing help?
- How should the facilitator view handle a student who is stuck or idle?
- Should the 4 loops be visually distinct (separate screens/states) or feel like a continuous flow?
- What happens to a student who finishes the bundle before the time block ends?

---

*This document captures intent and philosophy. All implementation decisions — technology stack, UI patterns, component structure, or even a new structure overall — are open for fresh design.*
