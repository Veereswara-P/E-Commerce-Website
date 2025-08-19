backend-service/README.md
MarketPlace E-Commerce Backend Service
This is the REST API for the MarketPlace E-Commerce application. It is built with Node.js and Express.js, and it handles all business logic, database interactions, and user authentication.

Features
RESTful API: Provides a complete set of endpoints for managing products, categories, users, carts, and wishlists.

Authentication & Authorization: Uses JSON Web Tokens (JWT) for secure, stateless authentication.

Role-Based Access Control: Distinguishes between standard users and administrators, with protected routes for admin-only actions.

Data Validation: Enforces data integrity using Joi for request body validation.

API Documentation: Automatically generates API documentation with Swagger, available at the /api-docs endpoint.

Tech Stack
Runtime: Node.js

Framework: Express.js

Database: PostgreSQL

Authentication: JSON Web Token (jsonwebtoken)

Password Hashing: bcryptjs

Validation: Joi

API Documentation: swagger-ui-express, swagger-autogen

Local Setup and Installation
Clone the repository.

Navigate to the backend directory:

Bash

cd backend-service
Install dependencies:

Bash

npm install
Set up the Database: Ensure you have a running PostgreSQL instance. Use the provided ER diagram and SQL scripts to create the database schema.

Create an environment file: Create a file named .env in the backend-service root and add the required variables (see below).

Run the development server:

Bash

npm run dev
The API server will start on the port specified in your .env file (e.g., http://localhost:5000).

Environment Variables
Create a .env file in the root of the backend-service directory. This file is required to connect to the database and manage security settings.

Code snippet

# PostgreSQL Database Connection
DB_USER=postgres
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=postgres

# JWT Secret
JWT_SECRET=your_super_secret_for_signing_tokens

# Server Port
PORT=5000

# --- Optional for Google Cloud SQL Deployment ---
# DB_CONNECTION_NAME=your-gcp-project:your-region:your-instance-name
Deployment
This application is designed to be deployed as a Docker container to a serverless platform like Google Cloud Run.

The database connection logic in config/db.js is built to work seamlessly with Google Cloud SQL. It automatically detects if it's running in a Google Cloud environment and will use a secure socket path (DB_SOCKET_PATH) if available, falling back to a standard IP connection (DB_HOST) for local development.