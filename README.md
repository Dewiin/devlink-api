# Devlink API
<a name="readme-top"></a>

<div align="center">
  <a href="https://rada-blog.vercel.app"><img src="./public/logo.png" alt="logo" width=150></a>
  <h1>Devlink</h1>
</div> <br>

<details open>
<summary>Table of Contents</summary>
<ol>
  <li>
    <a href="#introduction">Introduction</a>
    <ul>
      <li>
        <a href="#client">Client</a>
      </li>
    </ul>
  </li>
  <li>
    <a href="#features">Features</a>
    <ul>
      <li>
        <a href="#built-with">Built With</a>
      </li>
    </ul>
  </li>
  <li><a href="#endpoints">Endpoints</a></li>
  <li><a href="#getting-started">Getting Started</a></li>
  <li><a href="#contributing">Contributing</a></li>
  <li><a href="#license">License</a></li>
</ol>
</details>

## Introduction
Devlink API powers the backend for the Devlink messaging platform. It provides authentication, user management, conversation handling, and messaging functionality through a RESTful API.

This repository contains the server-side application.

### Client 
- Client Repository: https://github.com/Dewiin/devlink
- Client Deployment: https://devlink-chat.vercel.app

## Features
- ⚡ RESTful API Architecture
    - Simple and scalable API structure.
    - Organized route and controller system for maintainability.
- ✍️ CRUD Operations
    - Create, read, update, and delete blog posts.
    - Manage chats and conversations.
- 🛡️ Validation & Error Handling
    - Request validation for secure API interactions.
    - Structured error handling for consistent responses.
    - Protection against invalid or unauthorized requests.
- 🔐 Authentication & Authorization
    - JWT authentication with refresh token flow.
    - Google and GitHub OAuth integration using Passport.js.
    - Protected routes and role-based access control.
    - Secure HTTP-only cookie handling.

### Built With
[![TypeScript][TypeScript]][TypeScript-url]
[![Node][Node]][Node-url]
[![Express][Express]][Express-url]
[![PostgreSQL][PostgreSQL]][PostgreSQL-url]
[![Prisma][Prisma]][Prisma-url]

## Endpoints

### Auth
| Endpoint          | Method | Description           |
| ----------------- | ------ | --------------------- |
| /api/auth/signup  | POST   | Create a new user     |
| /api/auth/login   | POST   | Log in user           |
| /api/auth/logout  | GET    | Log out user          |
| /api/auth/refresh | GET    | Refresh access token  |
| /api/auth/me      | GET    | Retrieve current user |

### Chats
| Endpoint                   | Method | Description                         |
| -------------------------- | ------ | ----------------------------------- |
| /api/chat/                 | GET    | Retrieve Global Chat                |
| /api/chat/                 | POST   | Send message to global chat         |
| /api/chat/:recipientId     | GET    | Retrieve chat by recipient ID       |
| /api/posts/:conversationId | POST   | Send message to a conversation      |

### User
| Endpoint               | Method | Description                           |
| ---------------------- | ------ | ------------------------------------- |
| /api/users/            | GET    | Retrieve all users                    |
| /api/users/chats       | GET    | Retrieve current user's conversations |
| /api/users/search      | GET    | Search user by name                   |
| /api/users/:userId     | GET    | Retrieve user by id                   |
| /api/users/me          | PUT    | Update user's display name and bio    |
| /api/users/me/password | PUT    | Update user's password                |
| /api/users/me/avatar   | PUT    | Update user's avatar                  |
| /api/users/me/banner   | PUT    | Update user's banner                  |

## Getting Started

### Installation
```sh 
npm install
```

### Environment Variables
```sh
DATABASE_URL="your_data_url"
JWT_SECRET_KEY="your_jwt_secret"
JWT_REFRESH_KEY="your_refresh_secret"
CLIENT_URL="http://localhost:5173"
NODE_ENV="development"

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"

GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
GITHUB_CALLBACK_URL="http://localhost:3000/api/auth/github/callback"

CLOUDINARY_URL="your_cloudinary_url"
```

### Prisma setup
```sh
# Generate client and apply migrations
npx prisma migrate dev
npx prisma generate

# Open studio (optional)
npx prisma studio
```

### Running the server
```sh
npm run dev
```

## Contributing

Any kinds of contribution is welcome, such as:

- New features
- Bug fixes
- Typo fixes
- Suggestions
- Maintenance
- Documents
- etc.

#### Heres how you can contribute:

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push to the branch
5. Submit a pull request

<p align="right"><a href="#readme-top">Back to top</a></p>

## License

MIT License

Copyright (c) 2026 Devin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[TypeScript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/

[Node]: https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/en

[Express]: https://img.shields.io/badge/Express.js-404d59.svg?style=for-the-badge&logo=express&logoColor=61DAFB
[Express-url]: https://expressjs.com/

[PostgreSQL]: https://img.shields.io/badge/Postgres-316192.svg?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/

[Prisma]: https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/docs 