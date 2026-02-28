Dog Breed Recognition Service
1. Overview

A web service that recognizes a dog breed from a user-uploaded image.

User flow:

User uploads a dog photo.

The image is sent to the server.

The model performs inference.

The server returns Top-N predicted breeds with confidence scores.

The result is displayed to the user.

No database is used.
Uploaded images are not stored.

2. Architecture

Single server deployment.

Frontend: React + TypeScript (Vite)

Backend: FastAPI (Python)

Model: Loaded into memory on server startup

Storage: None

Request flow:

Client → POST /api/predict → Model inference → JSON response

3. API Specification
GET /api/health

Response:

{ "status": "ok" }
POST /api/predict

Request:

multipart/form-data

field name: file

Response:

{
  "request_id": "uuid",
  "predictions": [
    { "label": "beagle", "score": 0.87 },
    { "label": "labrador", "score": 0.09 },
    { "label": "basset_hound", "score": 0.02 }
  ],
  "latency_ms": 145
}

Error codes:

400 — Invalid file format

413 — File too large

500 — Inference error

4. Backend Requirements

FastAPI

python-multipart

Model loads once at application startup

Maximum file size limit (e.g. 5MB)

Validate MIME type

Do not persist uploaded images

Measure and return inference latency

Implement basic error handling

Enable CORS (restricted to frontend domain)

Inference Rules

Resize and normalize image

Convert to tensor

Return Top-K predictions (default: 3 or 5)

Confidence scores in range 0–1

5. Frontend Requirements
/

Landing page:

Hero section

“How it works” section

Call-to-action button (“Try Demo”)

/demo

Drag & drop upload area

Image preview

“Recognize” button

Loading indicator

Results section (Top-K list with confidence percentages)

Error display

UI states:

idle

uploaded

loading

success

error

6. Security & Limits

File size restriction

MIME type validation

Basic rate limiting

CORS policy configured

No image storage

No logging of image content

7. Performance Targets

Inference latency within acceptable CPU limits

API response under ~2–3 seconds for standard images

No memory leaks

Stable under moderate load

8. Definition of Done

The project is complete when:

Frontend builds successfully

Backend starts without errors

/api/predict returns real model predictions

Images are not stored

Error cases are handled correctly

The service runs on the target server

End-to-end upload → prediction flow works reliably

9. Development Order

Backend skeleton (FastAPI + health endpoint)

Mock /predict

Integrate real model inference

Build frontend landing

Implement upload + API integration

Add validation & error handling

Add security limits

Prepare production deployment

10. Implementation Rules

Work incrementally.

Do not move to the next step until the current one works.

Keep architecture minimal.

Do not introduce a database.

Do not persist uploaded images.

Keep the system simple and maintainable.

If you want, I can now generate:

A production-ready docker-compose.yml

A minimal FastAPI starter implementation

A minimal React demo page implementation

Or a Codex execution prompt based on this file