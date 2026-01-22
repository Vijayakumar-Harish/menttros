# MenttrOS – Architecture Principles

This document defines how MenttrOS is engineered.

---

## 🧱 Core Engineering Principles

1. Backend is the source of truth
2. Domain logic over frameworks
3. Explicit data models
4. No magic, no hidden side effects
5. Scale is designed, not guessed

---

## 🧠 Architectural Style

- Modular Monolith (initially)
- Domain-driven boundaries
- Clear separation of concerns

Layers:
- API Layer
- Application Layer
- Domain Layer
- Infrastructure Layer

---

## 🛠 Planned Stack

Backend:
- Node.js
- TypeScript
- Fastify

Database:
- PostgreSQL
- Prisma ORM

Auth:
- JWT (access + refresh)
- OAuth (future)

Frontend:
- React / Next.js (later phase)

---

## 🚦 Non-Goals (Important)

- No premature microservices
- No over-engineering
- No feature without a clear user problem

---

## 📈 Evolution Path

Phase 1: Modular monolith  
Phase 2: Internal service separation  
Phase 3: Selective microservices (only if required)

---

## 🧘 Engineering Discipline

If it’s unclear, we stop.
If it’s rushed, we redesign.
If it doesn’t scale logically, we remove it.
