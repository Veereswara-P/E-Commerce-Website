## User flows for the MarketPlace platform.

## 1. New User Registration and First Purchase
This flow describes the journey of a new user from discovering the site to making their first purchase.

Landing & Browsing: The user arrives on the Homepage. They can browse featured items, view categories, or use the search bar to find specific products.

Product Discovery: The user clicks on a product to view the Product Detail Page or clicks on a category to go to the Product List Page.

Attempt to Add to Cart: The user clicks "Add to Cart" on a product.

Redirect to Authentication: Since the user is not logged in, the application redirects them to the Authentication Page.

Registration: The user switches to the "Sign Up" form, fills in their details (name, email, password, gender), and submits.

Successful Registration: The user is automatically logged in and redirected back to the Homepage. A success alert confirms their account creation.

Shopping: The user can now add items to their cart and wishlist. They can view their selections on the Cart Page and Wishlist Page.

Profile Management: The user can navigate to their Profile Page to view or update their details.

## 2. Returning User Shopping Session
This flow describes the experience for a user who already has an account.

Login: The user navigates to the Authentication Page and logs in with their email and password.

Session Restoration: Upon successful login, the application restores their previous session. Their cart and wishlist items are fetched from the backend and displayed.

Continue Shopping: The user browses the site, adds or removes items from their cart/wishlist, and updates quantities on the Cart Page.

Logout: When finished, the user clicks the profile icon and selects "Logout." They are redirected to the login page, and their session is cleared.

## 3. Admin Product Management
This flow is for an authenticated user with an 'admin' role.

Admin Login: The user logs in with their admin credentials.

Access Admin Dashboard: The user clicks the profile icon, and because their role is 'admin', an "Admin Dashboard" link is visible in the dropdown menu.

Manage Products: On the Admin Dashboard, the admin can:

Create: Click "Add New Product" to open a form and add a new item to the database.

Update: Click "Edit" on any product to modify its details in a form.

Delete: Click "Delete" on any product to remove it from the database.

View Changes: Any changes made in the admin dashboard are immediately reflected on the public-facing site for all users.
