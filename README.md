# Comment System API

This is a backend server built with **NestJS** that provides a RESTful API and WebSocket support for a website displaying a comment system. Users can leave comments and replies in a threaded (cascade) structure, attach files, and view updates in real time.

## Features

### Authentication

- Local authentication for users to sign up and log in.
- OTP (One-Time Password) module designed for future email-based verification (e.g., password reset, email confirmation).

### Commenting System

- Users can:
  - Post comments.
  - Reply to other comments.
  - Attach media files (images, text files).
- Cascading structure of replies.
- Media validation:
  - Size limits.
  - Image resolution validation.
  - File type checking.

### Security

- Input validation and sanitization to prevent:
  - XSS (Cross-site Scripting)
  - SQL Injection
- Rate limiting to prevent spam (request limits per IP).

### WebSocket Integration

- Real-time updates for new comments using WebSocket (with JWT auth).
- Only relevant clients receive updates (not broadcasted to all).
- WebSocket and REST events are synchronized using internal events.

### Caching

- Reduces load on the database.
- Speeds up repeated requests.

### Modular Architecture

- Comment Module
- User Module
- Media Module
- Auth Module
- OTP Module
- Logging Module

### Pagination

- Implemented to optimize performance for large comment threads.

### Event System

- Internal events used for decoupled architecture.
- Current usage: logging actions to the database (extendable to email notifications, analytics, etc.).

## Technology Stack

- NestJS
- TypeScript
- WebSocket (with Gateway)
- MySQL
- Multer (for file uploads)
- Class-validator & class-transformer

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/comment-system-api.git
   ```
