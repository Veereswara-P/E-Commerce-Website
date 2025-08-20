-- =================================================================

-- Table: customer

-- Stores user information, credentials, and roles.

-- =================================================================

CREATE TABLE customer (

    customer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    customer_name VARCHAR(255) NOT NULL,
    
    customer_email VARCHAR(255) UNIQUE NOT NULL,
    
    customer_password VARCHAR(255) NOT NULL,
    
    customer_gender VARCHAR(50),
    
    customer_created_at TIMESTAMPTZ DEFAULT NOW()
    
);

-- =================================================================

-- Table: categories

-- Stores the main product categories.

-- =================================================================

CREATE TABLE categories (

    category_id SERIAL PRIMARY KEY,
    category_name TEXT NOT NULL,
    category_image_url VARCHAR(255),
    category_image_data BYTEA
);

-- =================================================================

-- Table: subcategories

-- Stores product subcategories, linked to a main category.

-- =================================================================

CREATE TABLE subcategories (

    subcategory_id SERIAL PRIMARY KEY,
    subcategory_name TEXT NOT NULL,
    category_id INTEGER REFERENCES categories(category_id) ON DELETE SET NULL
);

-- =================================================================

-- Table: products

-- Contains all product details and denormalized fields for performance.

-- =================================================================

CREATE TABLE products (

    product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    product_price NUMERIC(10, 2) NOT NULL,
    product_stock_quantity INTEGER NOT NULL,
    product_created_at TIMESTAMP DEFAULT NOW(),
    category_id INTEGER REFERENCES categories(category_id) ON DELETE SET NULL,
    subcategory_id INTEGER REFERENCES subcategories(subcategory_id) ON DELETE SET NULL,
    -- Denormalized columns for faster reads on product listings
    customer_gender VARCHAR(50),
    category_image_url VARCHAR(255),
    category_image_data BYTEA,
    category_name VARCHAR(255),
    subcategory_name VARCHAR(255)
);

-- =================================================================

-- Table: cart

-- A junction table linking customers to products in their shopping cart.

-- =================================================================

CREATE TABLE cart (

    customer_id UUID REFERENCES customer(customer_id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(product_id) ON DELETE CASCADE,
    product_quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    -- A customer can only have a specific product in their cart once.
    PRIMARY KEY (customer_id, product_id)
);

-- =================================================================

-- Table: wishlist_items

-- A junction table linking customers to their wishlisted products.

-- =================================================================

CREATE TABLE wishlist_items (

    customer_id UUID REFERENCES customer(customer_id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(product_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    -- A customer can only have a specific product in their wishlist once.
    PRIMARY KEY (customer_id, product_id)
);
