<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Healthcare API

Medical care management system built with NestJS and TypeScript.

## System Requirements

- Node.js 18+
- PostgreSQL 14+
- MongoDB 5+
- Docker (optional)

## Environment Configuration

1. Create a `.env` file at the root of the project:

```env
# Server
PORT=3000

# PostgreSQL (for patients, sessions, and invoices)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=dailysan
DB_PASSWORD=
DB_NAME=healthcare

# MongoDB (for configs and OHIP codes)
MONGODB_URI=mongodb://localhost:27017/healthcare

# JWT
JWT_SECRET=your-secret-key-here
```

## Local Installation

1. Clone the repository
2. Create the `.env` file with the configurations
3. Install dependencies:

```bash
npm install
```

4. Start PostgreSQL and MongoDB:
```bash
# PostgreSQL
pg_ctl -D /usr/local/var/postgres start

# MongoDB
brew services start mongodb-community
```

5. Start the application:
```bash
npm run start:dev
```

## API Documentation

The Swagger documentation is available at:
http://localhost:3000/api

## Docker

1. Build and run the containers:
```bash
docker-compose up --build
```

2. Access the application:
http://localhost:3000

3. Access the documentation:
http://localhost:3000/api

## Project Structure

```
src/
├── auth/            # Authentication and authorization
├── common/          # Utilities and shared modules
├── configs/         # Configurations (MongoDB)
├── patients/        # Patient management (PostgreSQL)
├── billing-sessions/ # Billing sessions (PostgreSQL)
├── invoices/        # Invoices (PostgreSQL)
├── ohip/            # OHIP codes (MongoDB)
├── roles/           # Role and permission management
└── audit-log/       # Audit logging
```

## Useful Scripts

```bash
# Start in development mode
npm run start:dev

# Build the application
npm run build

# Run tests
npm run test

# Run tests with coverage
npm run test:cov
```

## Postman Collection

We provide a comprehensive Postman collection to help you test the API endpoints. The collection includes all the necessary endpoints organized by category:

### Authentication
- POST `/auth/login` - Login with email and password
- POST `/auth/register` - Register new user

### Patients
- POST `/patients` - Create new patient
- GET `/patients` - List all patients
- GET `/patients/:id` - Get patient by ID
- GET `/patients/email/:email` - Get patient by email

### Invoices
- POST `/invoices` - Generate new invoice
- GET `/invoices` - List all invoices
- GET `/invoices/:id` - Get invoice by ID
- GET `/invoices/billing-session/:id` - Get invoices by billing session

### Billing Sessions
- POST `/billing-sessions` - Create new billing session
- GET `/billing-sessions` - List all billing sessions
- GET `/billing-sessions/:id` - Get billing session by ID
- GET `/billing-sessions/patient/:id` - Get billing sessions by patient

### OHIP Codes
- POST `/ohip` - Create new OHIP code
- GET `/ohip` - List all OHIP codes
- GET `/ohip/:id` - Get OHIP code by ID

### Configurations
- POST `/configs` - Create new config
- GET `/configs` - List all configs
- GET `/configs/:key` - Get config by key
- PUT `/configs/:key` - Update config value

### Roles
- GET `/roles` - List all roles
- GET `/roles/:id` - Get role by ID
- POST `/roles` - Create new role
- PUT `/roles/:id` - Update role
- POST `/roles/user` - Add role to user
- DELETE `/roles/user/:userId/:roleId` - Remove role from user

To use the collection:

1. Import the Postman collection file:
   - Collection: `docs/Healthcare-API.postman_collection.json`
   - Environment: `docs/Healthcare-API.postman_environment.json`

2. Set up the environment variables:
   - `base_url`: http://localhost:3000
   - `jwt_token`: (obtain from login response)
   - Predefined variables for testing in the environment file

3. The collection includes pre-request scripts and tests for most endpoints.

## Additional Resources

- [API Documentation](http://localhost:3000/api)
- [Postman Collection](docs/Healthcare-API.postman_collection.json)
- [Postman Environment](docs/Healthcare-API.postman_environment.json)
- [Source Code](https://github.com/yourusername/healthcare-api)

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
