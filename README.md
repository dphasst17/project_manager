<p> <img src="https://img.shields.io/badge/Next.js-000?logo=next.js&logoColor=white" alt="Next.js"/> <img src="https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white" alt="TypeScript"/> <img src="https://img.shields.io/badge/NestJS-ea2845?logo=nestjs&logoColor=white" alt="NestJS"/> <img src="https://img.shields.io/badge/Docker-2496ed?logo=docker&logoColor=white" alt="Docker"/> <img src="https://img.shields.io/badge/Redis-d82c20?logo=redis&logoColor=white" alt="Redis"/> <img src="https://img.shields.io/badge/MySQL-00758f?logo=mysql&logoColor=white" alt="MySQL"/> <img src="https://img.shields.io/badge/Microservices-6e40c9?logo=micro&logoColor=white" alt="Microservices"/> </p>

## Introduction

Fast PM is a full-featured project management system that provides tools for managing tasks, employees, and projects, tailored for teams of all sizes. It follows a microservice architecture to ensure scalability and maintainability.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js >= 18
- Docker & Docker Compose
- pnpm (or npm/yarn)
- MySQL (Dockerized)


## Technologies

- Next.js
- Typescript
- Nest.js
- Docker
- Redis
- MySQL
- Microservices

## Features of the project

- ✅ Authentication
- ✅ Authorization
- ✅ Project management
- ✅ Employee management
- ✅ Task management
- ✅ Admin management
- 🚧 Chat(work in progress)
- 🚧 File uploading(work in progress)

## Services Overview

This project is built with a microservices architecture. Here’s a brief overview of the services:

- `c/`: Frontend built with Next.js.
- `s/api/`: API Gateway to route requests to microservices.
- `s/auth/`: Handles user authentication and authorization.
- `s/project/`: Manages projects and related operations.
- `s/file/`: Handles file uploads and storage.
- `s/employees/`: Manages employee data and operations.
- `s/redis/`: Redis service for caching and pub/sub communication.


## Structure

This monorepo has the following structure:

```bash
.
├── c
│   ├── src
│   ├── ...
│   ├── next-env.d.ts
│   ├── package.json
│   └── tsconfig.json
├── s
│   ├── api
│   │   ├── src
│   │   ├── ...
│   │   ├── Dockerfile
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── project
│   │   ├── src
│   │   ├── ...
│   │   ├── Dockerfile
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── auth
│   │   ├── src
│   │   ├── ...
│   │   ├── Dockerfile
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── file
│   │   ├── src
│   │   ├── ...
│   │   ├── Dockerfile
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── employees
│   │   ├── src
│   │   ├── ...
│   │   ├── Dockerfile
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── redis
│   │   ├── src
│   │   ├── ...
│   │   ├── Dockerfile
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   └── tsconfig.json
├── docker-compose.yml
└── utils
└── .env
└── redis.conf
```

## Environment Variables

Each service may require its own `.env` file. Example for `s` service:
```bash
DB_USER=root
DB_NAME=dbName
DB_PASSWORD=dbPassword
HOST=host
PORT_SQL=3306
SALT=salt
SECRET=secret_key
NATS_URL=nats
SJ=subject
```

Example for `c` service:
```bash
NEXT_PUBLIC_URL_SERVER=http://localhost:{port_api_gateway}/api
NEXT_PUBLIC_IS_ADMIN=role_admin
NEXT_PUBLIC_IS_MANAGER=role_manager
```


## Installation

```bash
cd c
npm install
```

## Development Tips

- Use `docker-compose logs -f <service-name>` to debug a specific service.
- Rebuild containers after code changes using `docker-compose up --build`.
- Consider using tools like Postman or Insomnia for API testing.
## 📚 API Documentation

Each service provides its own Swagger documentation:
- API Gateway: [`http://localhost:3001/docs`](http://localhost:3001/docs)


## Useful Scripts

Some useful commands to manage services:

- `docker-compose up -d` - Start all backend services.
- `cd c && npm run dev` - Start the frontend development server.
- `docker-compose down` - Stop and remove all containers.

## License

This project is under the [MIT License](LICENSE)

## Notes

- If you can't access the website, it's because I've turned off the server. You have to wait until tomorrow morning or when I get into Ubuntu, I'll turn it back on.
