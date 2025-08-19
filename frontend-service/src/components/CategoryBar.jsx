import React from 'react';
import { Link } from 'react-router-dom';

const CategoryBar = ({ categories }) => {
  return (
    <nav className="category-bar">
      <div className="category-links">
        <Link to="/products">All</Link>
        {categories.map(cat => (
          <Link key={cat.category_id} to={`/products?category=${cat.category_id}`}>
            {cat.category_name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default CategoryBar;