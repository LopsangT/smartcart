# SmartCart 🛒

A full-stack, AI-powered shopping list app built with React and Spring Boot. Users can create an account, build a shopping list, track prices with live running totals, and get AI-generated product suggestions based on what's already in their cart.

> Built as a self-directed learning project to prepare for software engineering internship applications — from zero React/Spring Boot experience to a fully working full-stack app in 15 days.

---

## ✨ Features

- **User authentication** — secure registration and login with JWT tokens and BCrypt password hashing
- **Personal shopping lists** — every user has their own private list, enforced via a one-to-many database relationship
- **Full CRUD** — add, edit, delete, and clear shopping items
- **Live quantity & price tracking** — adjust quantity with +/- controls, edit prices inline, and see subtotals and a running total update instantly
- **AI-powered suggestions** — integrates with the Gemini API to suggest complementary items based on your current list, with one-click add
- **Protected routes** — unauthenticated users are automatically redirected to login

---

## 🛠️ Tech Stack

**Frontend**
- React (functional components, hooks)
- React Router
- Vanilla CSS

**Backend**
- Java 21 + Spring Boot
- Spring Security + JWT (io.jsonwebtoken)
- Spring Data JPA / Hibernate

**Database**
- PostgreSQL

**AI**
- Google Gemini API

---

## 🏗️ Architecture

```
React (localhost:3000)
   │  fetch + JWT bearer token
   ▼
Spring Boot REST API (localhost:8080)
   │  Spring Data JPA
   ▼
PostgreSQL
   │
   └── Gemini API (AI suggestions)
```

- `AuthController` — registration and login, returns a signed JWT
- `ShoppingItemController` — CRUD endpoints for items, scoped to the authenticated user via the JWT
- `GeminiService` — calls the Gemini API with the user's current list and parses suggested items
- `User` ⟷ `Item` — one-to-many relationship (`@ManyToOne` / `@JoinColumn`) so each item is tied to its owner

---

## 📸 Screenshots

**Shopping list with AI suggestions, quantity controls, and live price totals**
![Shopping list with AI suggestions](screenshots/shopping-list-ai-suggestions.png)

**Login**
![Login page](screenshots/login.png)

**Register**
![Register page](screenshots/register.png)

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- Java 21
- PostgreSQL
- A Gemini API key ([aistudio.google.com](https://aistudio.google.com))

### Backend setup
```bash
cd backend
# add your DB credentials and Gemini API key to src/main/resources/application.properties
./mvnw spring-boot:run
```

### Frontend setup
```bash
cd frontend
npm install
npm start
```

The app will be available at `http://localhost:3000`, with the API running on `http://localhost:8080`.

---

## 🗺️ Roadmap

- [ ] Deploy backend (AWS EC2/RDS) and frontend (Vercel)
- [ ] Swap Gemini for Claude API
- [ ] Add automated tests
- [ ] Persistent, environment-based JWT secret key

---

## 📚 What I Learned

This project was my introduction to full-stack development, covering:
- React fundamentals (state, props, hooks, routing)
- Building REST APIs with Spring Boot and Spring Data JPA
- Relational database design (one-to-many relationships, foreign keys)
- Authentication & security (JWT, password hashing, protected routes, CORS)
- Integrating a third-party AI API into a backend service
- Debugging across the full stack — from JS runtime errors to Java stack traces to SQL schema mismatches

---

## 👤 Author

**Lopsang** — [github.com/LopsangT](https://github.com/LopsangT)
