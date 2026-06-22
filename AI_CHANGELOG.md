# Project Timeline Summary

- Initial structure introduced a frontend interview flow with static farmer and farm questions.
- Backend support was added for MongoDB-backed session creation and persistence.
- Draft-resume functionality was introduced so an interview could continue from a saved point.
- Phone-based session startup and autofill were added to reduce re-entry friction.
- Review/editing and final submission logic were added to support a more complete onboarding workflow.
- The current codebase reflects a server-backed, resumable interview system with normalized response storage.

# Major Features Added

## Session Start and Resume
Purpose: Allow users to begin a new interview or continue an existing draft using the same phone number.
Files involved: backend/src/controllers/sessionController.js, frontend/pages/startPage.tsx, frontend/services/sessionService.ts
Dependencies: MongoDB, frontend store
Impact: Made the interview flow resumable and improved continuity for repeated visits.

## Autosave and Draft Recovery
Purpose: Persist interview progress so the user can return to the exact question and response state.
Files involved: backend/src/controllers/sessionController.js, frontend/pages/interviewPage.tsx, frontend/pages/reviewPage.tsx
Dependencies: Session API and MongoDB persistence
Impact: Reduced data loss risk and improved user experience for longer forms.

## Dynamic Block Question Generation
Purpose: Expand the questionnaire based on the farm’s reported block count.
Files involved: frontend/question-engine/engine/interviewEngine.ts, frontend/question-engine/generators/blockQuestionGenerator.ts
Dependencies: Question definitions and response state
Impact: Allowed the form to adapt to farms with multiple blocks without hardcoding a fixed number of sections.

## Review and Inline Editing
Purpose: Give users a final opportunity to confirm or correct responses before submission.
Files involved: frontend/pages/reviewPage.tsx, frontend/components/review/editableRow.tsx
Dependencies: Interview response state
Impact: Improved data quality and made corrections easier.

## Final Farmer Submission Storage
Purpose: Persist the final interview payload as a farmer document and mark the session as completed.
Files involved: backend/src/controllers/farmerController.js, backend/src/models/Farmer.js
Dependencies: MongoDB, InterviewSession data
Impact: Created a clear separation between active interview state and finalized submission data.

# Architectural Changes

- Added a centralized Zustand store for interview progress and responses.
- Introduced a backend session layer to persist drafts independently of the frontend state.
- Normalized interview payloads into farmer, farm, and blocks sections for consistency across the UI and database.
- Split session lifecycle management from final farmer submission storage to keep active and completed states distinct.
- Added a service layer in the frontend for communicating with the backend and external lookup services.

# Database Changes

- Added InterviewSession as the primary document for draft and active interview state.
- Added Farmer as the final submission document for completed onboarding data.
- Standardized response storage under a nested structure with farmer, farm, and blocks.
- Introduced a status field on sessions to support in_progress versus completed transitions.
- Added a phone index and unique session ID handling for lookup and resume behavior.

# API Changes

- Added /api/sessions/start for new or resumed session creation.
- Added /api/sessions/save for draft response persistence.
- Added /api/sessions/save-answer for current-question tracking.
- Added /api/sessions/complete for session completion.
- Added /api/sessions/:sessionId for session retrieval.
- Added /api/farmers/submit for final farmer record creation.

# Frontend Changes

- Added a multi-step onboarding route flow: start, language, instructions, interview, review, preview, success.
- Added a progress sidebar that reflects question completion by section.
- Added automated pincode lookup based on village input.
- Added inline review editing for field-level corrections before submission.
- Added autosave behavior during the interview and review stages.

# AI System Changes

- No generative AI or LLM workflow is currently implemented.
- The repository does not currently include prompt management, model selection, or AI output handling.
- The only external service integration is a deterministic geocoding lookup, not an AI system.

# Recent Refactors

## Response Shape Normalization
Reason: The data structure needed a consistent shape for storing farmer, farm, and block answers across state, review, and persistence.
Files: backend/src/controllers/sessionController.js, frontend/state/interviewStore.ts, frontend/types/response.ts
Impact: Reduced inconsistencies and made the review and submission paths simpler.

## Session Metadata Separation
Reason: Draft session state and finalized farmer submission data should not be mixed in the same document.
Files: backend/src/models/InterviewSession.js, backend/src/models/Farmer.js
Impact: Made the lifecycle clearer and reduced the chance of overwriting completed submission records.

## Debounced Autosave
Reason: Frequent writes during typing were not ideal for user experience or API behavior.
Files: frontend/pages/interviewPage.tsx, frontend/pages/reviewPage.tsx
Impact: Reduced write frequency while keeping drafts up to date.

# Known Issues

- The UI’s preview/submit path appears to mark the session complete without consistently invoking the farmer submission endpoint that creates the final Farmer document.
- Success screen shows a hardcoded reference ID rather than a real submission identifier.
- The current app has no authentication or authorization layer.
- The frontend relies on a client-side geocoding API key, which is not ideal for production security posture.
- The progress helper uses debug logging and may be noisy during normal operation.

# Technical Debt

- Duplicate field-mapping logic exists across interview form handling and progress calculations.
- The API base URL is hardcoded in the frontend service layer.
- Validation and error handling are present but not comprehensive across all flows.
- There are no automated tests for backend or frontend behavior.
- The current UI is not yet fully localized despite the presence of a language-selection page.

# Next Recommended Tasks

Priority: High
Task: Wire the submission flow so the preview/submit action creates the final Farmer record consistently and marks the session completed only after that succeeds.
Reason: The current implementation appears to leave the final persisted farmer record path incomplete.
Affected files: frontend/pages/jsonPreview.tsx, backend/src/controllers/farmerController.js, frontend/services/sessionService.ts

Priority: High
Task: Add authentication and access control if the onboarding flow is intended for real-world multi-user usage.
Reason: The current implementation has no user identity or permission model.
Affected files: backend/src/server.js, backend/src/routes/*, frontend/pages/startPage.tsx

Priority: Medium
Task: Add automated tests and stronger validation around session creation, autosave, and submission.
Reason: The flow is core business logic and should be protected from regressions.
Affected files: backend/src/controllers/*, frontend/pages/*

Priority: Medium
Task: Replace the hardcoded success reference and client-side lookup handling with a more robust production-ready pattern.
Reason: The current experience is functional but not production-grade.
Affected files: frontend/pages/success.tsx, frontend/services/pincodeService.ts

# Future AI Handoff

Current focus: Finalize the submission path and make the onboarding flow robust for real-world use.
Most important files: backend/src/controllers/sessionController.js, backend/src/controllers/farmerController.js, frontend/pages/interviewPage.tsx, frontend/pages/jsonPreview.tsx, frontend/state/interviewStore.ts
Most important models: InterviewSession, Farmer
Most important APIs: /api/sessions/save, /api/sessions/complete, /api/farmers/submit
Most important pages: /interview, /review, /preview, /success
Known risks: Missing authentication, incomplete final submission wiring, and lack of automated coverage
Recommended next implementation: Create a single end-to-end submission path that persists the farmer record and session state atomically and then surfaces the resulting submission reference to the user.
