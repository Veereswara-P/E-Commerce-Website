## Overall Architecture
The MarketPlace platform is built on a modern, decoupled, three-tier architecture. This design separates the application into a frontend client, a backend API service, and a managed database, all hosted on Google Cloud Platform. This separation allows each component to be developed, deployed, and scaled independently.

## Frontend Architecture (Client-Side)
The frontend is a Single-Page Application (SPA) built with React.js and Vite.

UI & Components: The user interface is built with reusable React components and styled using a combination of Tailwind CSS and custom CSS for a modern, responsive design.

Routing: React Router manages all client-side navigation, allowing for a seamless user experience without full page reloads. The main routing logic is defined in App.jsx.

State Management: Global application state (like user authentication, shopping cart, and wishlist) is managed using React's Context API. This provides a centralized and efficient way to share data across components without prop drilling.

API Communication: Axios is used for all communication with the backend REST API. A global interceptor is configured in api.js to automatically attach the user's JWT authentication token to the headers of protected requests.

Data Fetching: The application uses TanStack Query (React Query) to handle all server state. This provides powerful features like caching, automatic refetching, and loading/error state management, which significantly improves performance and the user experience.

## Backend Architecture (Server-Side)
The backend is a stateless RESTful API built with Node.js and the Express.js framework.

API Structure: The API is organized logically into routes, controllers, and middleware.

Routes: Define the API endpoints (e.g., /api/products, /api/auth).

Controllers: Contain the business logic for each route (e.g., fetching products from the database, handling user registration).

Middleware: Handles cross-cutting concerns like JWT authentication (auth.js), role-based access control (isAdmin.js), and request validation using Joi (validation.js).

Authentication: The service uses JSON Web Tokens (JWT) for stateless authentication. When a user logs in, a token is generated and sent to the client. This token is then required for all protected endpoints. Passwords are securely hashed using bcryptjs.

API Documentation: Swagger is integrated to automatically generate and serve interactive API documentation, which is accessible at the /api-docs endpoint.

## Database
The application's data layer is a managed PostgreSQL database hosted on Google Cloud SQL.

Schema: The database follows a relational model with tables for customer, products, categories, cart, and wishlist_items. It uses foreign key constraints to maintain data integrity.

Connectivity:

Local Development: The backend connects to the cloud database using its public IP address, which requires firewall rules to be configured in Cloud SQL.

Cloud Run (Deployed): When deployed, the backend connects securely and efficiently using a Cloud SQL socket path. This is a more secure method that doesn't expose the database to the public internet. The connection logic in db.js is designed to handle both scenarios automatically.

## Deployment & Infrastructure
Both the frontend and backend services are containerized using Docker and deployed independently to Google Cloud Run.

Backend Deployment: The backend-service is a standard Node.js application container. Cloud Run manages its scaling automatically, from zero to multiple instances based on incoming traffic.

Frontend Deployment: The frontend-service uses a multi-stage Dockerfile.

Build Stage: It first builds the React application into static HTML, CSS, and JS files using Vite.

Serve Stage: It then copies these static files into a lightweight Nginx web server container, which serves the application to users.

Scalability: Using Cloud Run allows both services to scale independently. For example, if there is a high volume of user traffic but few purchases, the frontend can scale up to handle the load without needing to scale the backend, which is a very cost-effective approach.
