UI walkthrough of the MarketPlace application, detailing the user experience from the main landing page to the admin dashboard.

## 1. Main Interface & Navigation
When a user first visits the site, they are presented with a clean and modern interface designed for intuitive product discovery.

Header: The header is the primary navigation hub. It features:

The MarketPlace logo, which links back to the homepage.

A prominent global search bar in the center for finding products and categories.

Navigation icons on the right for Wishlist, Cart, and a Profile Menu for login/logout and accessing user-specific pages.

Homepage: The main content area displays:

A "Shop by Category" section, allowing users to quickly filter products.

A grid of "Featured Items" that uses infinite scroll, loading more products as the user scrolls down.

## 2. Browsing and Shopping
The core shopping experience is designed to be seamless.

Product Card: Each product is displayed on a card that shows its image, name, and price. It features two main actions:

A heart icon to add the item to the wishlist.

An "Add to Cart" button.

Product Detail Page: Clicking anywhere on a product card (except the buttons) navigates the user to a detailed view with a larger image, a full description, and prominent "Add to Cart" and "Wishlist" buttons.

Cart & Wishlist Pages:

The Cart Page lists all added items, allowing users to update quantities or remove items.

The Wishlist Page displays all saved items in a grid, from which users can add them to the cart or remove them from the list.

## 3. Authentication & User Profile
The authentication process is consolidated into a single, user-friendly page.

Auth Page: When a non-logged-in user clicks the profile icon, they are taken to the /auth route. This page initially shows the Login form.

Switching Forms: A link at the bottom allows the user to easily switch to the Registration form if they don't have an account.

User Profile: Once logged in, this same /auth route automatically displays the Profile Page, where users can view their details, update their name, and access a "Danger Zone" to delete their account.

## 4. Admin Dashboard
For users with an 'admin' role, the profile menu contains an additional link to the Admin Dashboard.

Product Management Table: The dashboard presents a comprehensive table of all products in the database.

Admin Actions:

Create: A prominent "Add New Product" button opens a modal form to add a new item.

Update & Delete: Each row in the table has "Edit" and "Delete" buttons, allowing for quick management of existing products. The "Edit" button opens the same form, pre-filled with the product's current data.
