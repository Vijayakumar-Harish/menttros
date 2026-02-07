# MenttrOS 🚀

MenttrOS is a growth operating system designed to help learners, mentors, and early professionals
build real skills, track meaningful progress, and achieve career clarity.

This is not a traditional LMS.
This is a system for structured learning, mentorship, and proof-of-work.

## MenttrOS Vision

MenttrOS is a proof-driven mentorship platform where:

- Skills are learned through practice
- Progress is validated by mentors
- Advancement is earned, not assumed
- Feedback is central to growth

This system is designed to scale from individuals to institutions.

## 🌱 Why MenttrOS?

Learning today is broken.
Courses are everywhere, but direction, accountability, and mentorship are missing.

MenttrOS solves this by:
- Treating skills as systems, not videos
- Making mentorship structured and scalable
- Turning learning into real, reviewable work

## API Overview

- Auth: `/auth/*`
- Skills: `/skills`, `/me/learning`
- Proofs: `/skills/:id/proof`, `/mentor/proofs`
- Notifications: `/me/notifications`

All APIs are secured and role-aware.

## API Versioning

All APIs are exposed under `/api/v1`.
Future versions will not break existing clients.

## Search & Filters

- Skills can be searched by name
- Proofs can be filtered by status

## 🧠 Core Principles

- Learn by doing
- Mentorship over content
- Proof over certificates
- Systems over shortcuts

## Core Concepts

- Learners enroll in skills
- Mentors teach skills
- Learners submit proof of work
- Mentors review and approve
- Skill level increases based on validated proof

## Learning Flow

1. Learner enrolls in a skill
2. Learner submits proof of work
3. Mentor reviews and gives feedback
4. Skill level increases on approval
5. Learner repeats until mastery

## 🧱 Planned Modules

- Skill Graph Engine
- Mentor Workflows
- Proof-of-Work Portfolio
- Career Readiness Dashboard
- Institution & Community Support

## 🛠 Tech Stack (Planned)

- Backend: Node.js (Fastify), TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT + OAuth
- Frontend: React / Next.js
- Infrastructure: Docker, Cloud Native

## System Boundaries

MenttrOS intentionally does not:
- Auto-promote skills without mentor approval
- Allow anonymous actions
- Permanently delete learning data

These boundaries protect trust, quality, and accountability.

## Deployment Notes

- Requires PostgreSQL
- Environment variables must be set
- Prisma migrations must run before start
- Health endpoint available at `/health`

## 🚧 Status

🧪 Early development  
Currently setting up foundation, architecture, and core domain models.

## 🤝 Contribution

This project is in its early phase.
Contributions, ideas, and feedback are welcome.

## 📜 Vision

MenttrOS aims to become the operating system for learning and career growth in the modern world.
