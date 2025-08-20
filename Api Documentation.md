## MarketPlace E-Commerce API Documentation
This document provides a detailed specification for the REST API of the MarketPlace E-Commerce platform, covering all endpoints for authentication, products, administration, and user actions.

Base URL:https://backend-service-721810542467.asia-south2.run.app/

Authentication
Authentication is handled using JSON Web Tokens (JWT). A token must be included in the Authorization header for all protected routes.

Header Format: Authorization: Bearer <YOUR_JWT_TOKEN>

## 1. Authentication Endpoints (/auth)
**Register a New User**
Endpoint: POST /auth/register

Description: Creates a new customer account.

Auth: None

Request Body:

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "gender": "male"
}

**Login a User**
Endpoint: POST /auth/login

Description: Authenticates a user and returns a JWT.

Auth: None

Request Body:

{
  "email": "john.doe@example.com",
  "password": "password123"
}

Get Current User
Endpoint: GET /auth/me

Description: Retrieves the profile of the currently authenticated user.

Auth: Required

**Update User Profile**
Endpoint: PATCH /auth/profile

Description: Updates the name of the currently authenticated user.

Auth: Required

Request Body:

{
  "name": "Johnathan Doe",
}

**Delete User Account**
Endpoint: DELETE /auth/profile

Description: Deletes the account of the currently authenticated user.

Auth: Required

**Logout**
Endpoint: POST /auth/logout

Description: This endpoint exists but logout is handled client-side by deleting the token.

Auth: None

## 2. Product & Category Endpoints
**Get All Products**
Endpoint: GET /products

Description: Fetches a paginated list of products with filtering and sorting options.

Auth: None

Get a Single Product by ID
Endpoint: GET /products/:id

Description: Fetches details for a specific product.

Auth: None

**Get All Categories**
Endpoint: GET /categories

Description: Fetches a list of all main product categories.

Auth: None

**Get Subcategories by Category ID**
Endpoint: GET /categories/subcategories/:categoryId

Description: Fetches a list of subcategories for a given main category.

Auth: None

## 3. Cart Endpoints (/cart)
**Get Cart Items**
Endpoint: GET /cart

Description: Retrieves all items in the authenticated user's cart.

Auth: Required

**Add Item to Cart**
Endpoint: POST /cart

Description: Adds a product to the cart. If the item already exists, its quantity is increased.

Auth: Required

**Decrease Item Quantity**
Endpoint: PUT /cart/decrease/:productId

Description: Decreases an item's quantity in the cart by one.

Auth: Required

**Remove Item from Cart**
Endpoint: DELETE /cart/:productId

Description: Removes a single item completely from the cart.

Auth: Required

**Clear Entire Cart**
Endpoint: DELETE /cart

Description: Removes all items from the user's cart.

Auth: Required

## 4. Wishlist Endpoints (/wishlist)
**Get Wishlist Items**
Endpoint: GET /wishlist

Description: Retrieves all items in the authenticated user's wishlist.

Auth: Required

**Add Item to Wishlist**
Endpoint: POST /wishlist

Description: Adds a product to the user's wishlist.

Auth: Required

**Remove Item from Wishlist**
Endpoint: DELETE /wishlist/:productId

Description: Removes a product from the user's wishlist.

Auth: Required

## 5. Admin Endpoints (/admin)
Note: All admin routes require a user to be authenticated and have the role of 'admin'.

**Create a New Product**
Endpoint: POST /admin/products

Auth: Admin Required

**Update a Product**
Endpoint: PUT /admin/products/:id

Auth: Admin Required

**Delete a Product**
Endpoint: DELETE /admin/products/:id

Auth: Admin Required

## 6. Search Endpoint (/search)
**Global Search**
Endpoint: GET /search

Description: Searches for products and categories matching a query string.

Auth: None

Query Parameters:

q (string): The search term.

## 7. Customer Endpoint (/customer)
Update Customer by ID
Endpoint: PUT /customer/:id

Description: Updates a customer's details. Note: This is a general endpoint; for a logged-in user, using PATCH /auth/profile is preferred.

Auth: None (or Admin, depending on security policy)
