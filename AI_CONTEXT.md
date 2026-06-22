# Project Overview

- Project purpose: A mobile-first farmer onboarding workflow that collects structured farmer, farm, and block information through a guided interview experience, saves draft progress, and submits completed data for persistence.
- Primary users: Field staff or enumerators using the web app to collect onboarding data; the current implementation is centered on a single interview flow rather than separate admin or farmer portals.
- Main workflows: Start a session with a phone number, answer interview questions, auto-save progress, review/edit responses, and submit the completed session.
- Business objectives: Reduce manual paperwork, support resumable interviews, and store structured data in a database for downstream processing.

# Tech Stack

## Frontend

- Frameworks: React with Vite and TypeScript
- Libraries: React Router, Zustand, Lucide icons, Tailwind-style utility classes
- UI systems: Custom component-based UI with responsive single-page flow
- State management: Zustand store for interview state and response persistence

## Backend

- Runtime: Node.js
- Frameworks: Express.js
- APIs: REST-style JSON endpoints for session and farmer submission workflows

## Database

- Database technology: MongoDB via Mongoose ODM
- Models: InterviewSession, Farmer
- Collections: interviewsessions, farmers
- Relationships: Current implementation keeps session metadata and final submitted farmer data separate; the farmer submission flow reuses session responses and stores a final farmer record.

## External Services

- AI providers: None currently integrated
- Authentication providers: None in the current implementation
- Mapping providers: Geoapify for pincode lookup
- Third-party integrations: Browser fetch calls to the backend and the Geoapify geocoding API

# Repository Structure

- backend/: Express server, MongoDB connection, route/controller/model layer
- frontend/: React app, route pages, interview question engine, services, state, and UI components
- question-engine/: Question definitions and dynamic block question generation
- services/: HTTP wrappers for backend and external lookup calls
- state/: Zustand interview store
- types/: Shared TypeScript interfaces for questions and responses

# System Architecture

- Frontend architecture: The frontend is a route-driven React application with page-level views for onboarding steps, a centralized Zustand store for interview state, and service modules for backend communication.
- Backend architecture: A small Express API exposes session-management endpoints and a farmer-submission endpoint. Controllers interact with Mongoose models and enforce simple validation and status transitions.
- Request flow: The user starts a session from the landing page; the frontend calls the session API, then walks through interview pages while autosaving state to the backend. On review, the user can edit responses before submitting the session.
- Data flow: Interview answers are stored in the Zustand store and periodically posted to the backend as normalized response payloads. The server persists them under the session document, and the final farmer submission creates a dedicated farmer record.
- State flow: The Zustand store owns current question index, session ID, phone number, question list, and response objects. It supports resume behavior by restoring a session’s current question and saved responses.
- Authentication flow: There is no authentication or authorization layer in the current implementation.
- AI integration flow: There is no AI provider integration at present; the app relies on deterministic question flow and an external pincode lookup service.

# Core Features

## Session Start and Resume
Purpose: Create or resume a phone-based onboarding session.
Important files: backend/src/controllers/sessionController.js, backend/src/routes/sessionRoutes.js, frontend/pages/startPage.tsx, frontend/services/sessionService.ts
Flow: The app validates a 10-digit phone number, checks for an in-progress session, and either resumes the draft or starts a new one.
Dependencies: MongoDB, UUID generation, frontend store
Business rules: Only one in-progress session per phone is allowed by the current backend logic.

## Interview Question Flow
Purpose: Deliver a structured questionnaire covering farmer details, farm details, and dynamically generated block details.
Important files: frontend/question-engine/engine/interviewEngine.ts, frontend/question-engine/farmer/questions.ts, frontend/question-engine/farm/questions.ts, frontend/question-engine/generators/blockQuestionGenerator.ts
Flow: The app initializes a base question list and adds block questions based on the farm block count.
Dependencies: Zustand store, question type definitions, validator utilities
Business rules: Block questions are inserted after the farm photo question and depend on the reported block count.

## Autosave and Draft Recovery
Purpose: Persist interview progress and restore it later.
Important files: frontend/pages/interviewPage.tsx, frontend/pages/reviewPage.tsx, frontend/services/sessionService.ts, backend/src/controllers/sessionController.js
Flow: The frontend debounces response changes and posts them to the backend. On startup, the app can resume from the saved current question ID and responses.
Dependencies: Session API, persisted session document
Business rules: The server normalizes stored responses into farmer, farm, and blocks sections.

## Review and Edit
Purpose: Let the user verify and correct answers before final submission.
Important files: frontend/pages/reviewPage.tsx, frontend/components/review/editableRow.tsx, frontend/components/review/reviewCard.tsx
Flow: The review page renders grouped sections with inline editing for each field.
Dependencies: Interview response state and question definitions
Business rules: Edits are validated before being written back into the store.

## Final Submission
Purpose: Mark the session as completed and persist the final farmer submission record.
Important files: backend/src/controllers/farmerController.js, backend/src/controllers/sessionController.js, frontend/pages/jsonPreview.tsx
Flow: The backend creates a farmer document from the session responses and updates session status to completed.
Dependencies: MongoDB, session storage
Business rules: Duplicate phone submission is handled by reusing an existing farmer record rather than failing on duplicate insert.

# Database Schema Summary

## InterviewSession
Purpose: Stores interview progress, status, and current question index for a user session.
Fields: sessionId, phone, currentQuestionId, status, responses, lastSavedAt, timestamps
Relationships: One session can produce one final farmer submission.
Indexes: phone index on the phone field; sessionId is unique.
Validation: Required fields and enum-based status values.
Business logic: Handles draft and completed session lifecycle.

## Farmer
Purpose: Stores the final submitted onboarding payload for a farmer.
Fields: phone, farmer, farm, blocks, submittedAt
Relationships: Derived from a completed InterviewSession.
Indexes: phone is unique.
Validation: phone is required and unique.
Business logic: Final persisted submission record; session metadata is intentionally not duplicated here.

# API Documentation

## POST /api/sessions/start
Method: POST
Path: /api/sessions/start
Purpose: Start a new session or resume an in-progress session for a phone number.
Request: { phone }
Response: { resume, session }
Validation: Phone number is required.
Dependencies: InterviewSession model, UUID generation

## POST /api/sessions/complete
Method: POST
Path: /api/sessions/complete
Purpose: Mark a session as completed.
Request: { sessionId }
Response: { message }
Validation: Session must exist.
Dependencies: InterviewSession model

## POST /api/sessions/save-answer
Method: POST
Path: /api/sessions/save-answer
Purpose: Persist the current question ID for resume behavior.
Request: { sessionId, currentQuestionId }
Response: { success, message }
Validation: Session must exist.
Dependencies: InterviewSession model

## POST /api/sessions/save
Method: POST
Path: /api/sessions/save
Purpose: Persist a normalized snapshot of the interview responses and current question.
Request: { sessionId, responses, currentQuestionId }
Response: { success, message }
Validation: Session must exist.
Dependencies: InterviewSession model, response normalization logic

## GET /api/sessions/:sessionId
Method: GET
Path: /api/sessions/:sessionId
Purpose: Load a saved session by its ID.
Request: Route parameter sessionId
Response: { success, session }
Validation: Session must exist.
Dependencies: InterviewSession model

## POST /api/farmers/submit
Method: POST
Path: /api/farmers/submit
Purpose: Create a final farmer record from an interview session and complete it.
Request: { sessionId }
Response: { success, message, farmerId }
Validation: Session must exist and not already be completed.
Dependencies: InterviewSession model, Farmer model

# Frontend Pages

## /
Route: /
Purpose: Landing page for session start.
Data dependencies: Phone input, interview store reset
Actions: Validates phone, starts or resumes session, navigates to the next step
Navigation flow: Leads to /language or directly to the interview flow for resumed sessions

## /language
Route: /language
Purpose: Language selection step.
Data dependencies: Resume state from the store
Actions: Chooses a language and continues
Navigation flow: Sends the user to /instructions or /interview depending on draft state

## /instructions
Route: /instructions
Purpose: Displays onboarding instructions.
Data dependencies: None
Actions: Navigate to the interview
Navigation flow: Leads to /interview

## /interview
Route: /interview
Purpose: Main question-answering experience.
Data dependencies: Question list, response store, session ID
Actions: Answer questions, validate input, move among questions, autosave
Navigation flow: Leads to /review when all questions are complete

## /review
Route: /review
Purpose: Review and edit collected answers.
Data dependencies: Responses and question definitions
Actions: Edit answers inline and continue to preview
Navigation flow: Leads to /preview

## /preview
Route: /preview
Purpose: Shows a JSON preview of the collected responses.
Data dependencies: Current store responses
Actions: Submit the interview
Navigation flow: Leads to /success after completion

## /success
Route: /success
Purpose: Final confirmation screen.
Data dependencies: None
Actions: Restart the flow
Navigation flow: Returns to /

# State Management

- Zustand stores: The app uses one main store, useInterviewStore, to manage session ID, phone number, question list, current index, resume question pointer, and the structured response object.
- Redux stores: None
- React Contexts: None
- Local storage: None used in current implementation
- Session storage: None used in current implementation

# AI Components

- Models used: None
- Prompts used: None
- Responsibilities: No generative AI or LLM workflow exists in the current repository.
- Limitations: The app does not currently use AI for question generation, conversational assistance, or response summarization.
- Generated outputs: No AI-generated artifacts are produced by the app.
- AI workflows: None

# Configuration

- Backend environment variables: PORT, MONGODB_URI
- Frontend environment variables: VITE_GEOAPIFY_API_KEY
- Configuration files: backend/package.json, frontend/package.json, frontend/vite.config.ts, frontend/tsconfig.json

# Design Decisions

- The interview state is centralized in a single Zustand store rather than spread across page-local state.
- Responses are normalized into farmer, farm, and blocks sections to keep persistence and review logic consistent.
- Session metadata and final submitted farmer data are separated into two models to avoid mixing draft and completed state.
- Question generation is data-driven; block questions are injected dynamically based on the user’s block count.
- Autosave is debounce-based so the UI remains responsive while preserving draft progress.

# Security Notes

- Authentication mechanisms: None implemented.
- Authorization mechanisms: None implemented.
- Sensitive data handling: Phone numbers and interview responses are stored in the database; no additional encryption layer is evident in the current code.
- Security concerns: The frontend uses a client-side environment variable for a geocoding lookup, which is not a secure place to keep sensitive credentials; the current app also lacks an authentication layer and server-side authorization checks.

# Scalability Notes

- Bottlenecks: The current implementation uses a single Express process and straightforward MongoDB document updates; it is appropriate for small to medium traffic but may be limited as the number of sessions grows.
- Performance concerns: Autosave is debounced and simple, but every response change still triggers network activity and database writes.
- Scaling limitations: No caching layer, queueing, or background processing exists; no multi-tenant or role-based architecture is implemented.

# Current Development Status

- Completed modules: Session start/resume, interview flow, dynamic block generation, autosave, review/edit flow, MongoDB persistence, final farmer submission endpoint
- Work-in-progress modules: Language selection is present but not yet connected to a full i18n system; the success and preview experience are basic and do not yet expose a real submission identifier
- Experimental features: None in the current codebase
- TODO comments: None found in source files
- FIXME comments: None found in source files

# Quick Context For Future AI Sessions

This repository contains a small but structured farmer onboarding application. The current implementation uses a React/Vite frontend with a Zustand store and a Node/Express backend backed by MongoDB. The main flow is phone-based session creation, guided interview questions for farmer and farm details, dynamic block questions, autosave/draft recovery, review/editing, and final submission. The key models are InterviewSession and Farmer, and the core APIs live under /api/sessions and /api/farmers. The most important next priorities are to wire the UI to the farmer submission endpoint consistently, add real authentication or access control if required, and strengthen validation/tests around the submission path.
