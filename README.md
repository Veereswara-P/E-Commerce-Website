# E-Commerce-Website

MarketPlace E-Commerce Platform
A modern, full-stack e-commerce application featuring a feature-rich frontend built with React and a robust backend API powered by Node.js, all deployed on Google Cloud Platform.

🚀 Live Demo
Frontend Application: https://frontend-service-721810542467.asia-south2.run.app/

Backend Base URL: https://e-commerce-backend-721810542467.asia-south2.run.app

✨ Features
Frontend
Modern UI: A responsive and interactive user interface built with React and Vite.

Component-Based Architecture: Reusable components for products, navigation, and user interactions.

Client-Side Routing: Seamless navigation without page reloads using react-router-dom.

State Management: Centralized state management using React's Context API for authentication, cart, and wishlist.

User Authentication: Complete user authentication flow (Login, Register, Logout) with profile management.

Shopping Cart: Fully functional shopping cart to add, update quantities, and remove products.

Wishlist: Functionality for users to save and manage their favorite products.

Product Discovery: Browse products by category and product name, an infinite scroll on the homepage, and a global search feature.

Backend
RESTful API: A robust REST API built with Node.js and Express.js.

Secure Authentication: JWT-based authentication with password hashing using bcryptjs.

Managed Database: Uses Google Cloud SQL for PostgreSQL for a reliable and scalable data layer.

Product Management: API endpoints to fetch products with advanced filtering, sorting, and pagination.

Cart & Wishlist Management: Secure endpoints to manage user-specific cart and wishlist data.

🗃️ Database Schema
The application uses Google Cloud SQL for PostgreSQL as its managed database service. The relational schema is designed to support all e-commerce functionalities, including tables for customers, products, categories, shopping cart, and wishlists.

🛠️ Technology Stack
Frontend
Framework: React.js, Vite

Routing: React Router

Styling: Tailwind CSS, Custom CSS

API Client: Axios

Deployment: Nginx, Docker, Google Cloud Run

Backend
Framework: Node.js, Express.js

Database: Google Cloud SQL (PostgreSQL)

Authentication: JSON Web Tokens (JWT), bcryptjs

Deployment: Docker, Google Cloud Run

📂 Project Structure
The project is organized in a monorepo style with two main directories:

/
├── frontend-service/   # Contains the React frontend application
└── backend-service/    # Contains the Node.js Express backend API
⚙️ Environment Variables
The project's configuration is managed through environment variables.

Backend (backend-service/.env)
This file contains the database credentials and security keys for the backend service.


# Google Cloud SQL Database Connection
DB_USER=your_db_user
DB_HOST=your_cloud_sql_ip_address
DB_DATABASE=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432

# JWT Secret Key
JWT_SECRET=your_super_secret_random_string

# The URL of the deployed frontend for CORS
CLIENT_URL=https://frontend-service-721810542467.asia-south2.run.app
Frontend (frontend-service/.env)
This file tells the frontend where to find the backend API.

Ini, TOML

# The full base URL of your deployed backend API
VITE_API_URL=https://e-commerce-backend-721810542467.asia-south2.run.app/api
☁️ Deployment
Both the frontend and backend services are containerized using Docker and are deployed on Google Cloud Run.

Frontend: A production build of the React app is created and served via a lightweight Nginx server within its container.

Backend: The Node.js Express API runs in its own container and connects to the managed Google Cloud SQL database instance.
