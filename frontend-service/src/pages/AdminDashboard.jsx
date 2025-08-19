import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import api from '../api';
import Loader from '../components/Loader';
import { useAlert } from '../components/Alert';

// Reusable Product Form Component
const ProductForm = ({ product, onSubmit, onCancel }) => {
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    // When the product to edit changes, reset the form with its values
    if (product) {
      reset(product);
    } else {
      reset({});
    }
  }, [product, reset]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">{product ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form fields for all product properties */}
          <div className="grid grid-cols-2 gap-4">
            <input {...register("product_name")} placeholder="Product Name" className="p-2 border rounded" required />
            <input {...register("product_price")} type="number" step="0.01" placeholder="Price" className="p-2 border rounded" required />
            <input {...register("product_stock_quantity")} type="number" placeholder="Stock" className="p-2 border rounded" required />
            <input {...register("category_id")} placeholder="Category ID" className="p-2 border rounded" required />
            <input {...register("subcategory_id")} placeholder="Subcategory ID" className="p-2 border rounded" />
            <input {...register("category_name")} placeholder="Category Name" className="p-2 border rounded" />
            <input {...register("subcategory_name")} placeholder="Subcategory Name" className="p-2 border rounded" />
            <input {...register("customer_gender")} placeholder="Customer Gender" className="p-2 border rounded" />
          </div>
          <textarea {...register("product_description")} placeholder="Description" className="w-full p-2 border rounded mt-4" />
          <input {...register("category_image_url")} placeholder="Image URL" className="w-full p-2 border rounded mt-4" />

          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">{product ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Admin Dashboard Component
const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const showAlert = useAlert();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['allProductsAdmin'],
    queryFn: () => api.get('/products?limit=1000').then(res => res.data.data.products)
  });

  const createMutation = useMutation({
    mutationFn: (newProduct) => api.post('/admin/products', newProduct),
    onSuccess: () => {
      showAlert('Product created successfully!');
      queryClient.invalidateQueries(['allProductsAdmin']);
      setIsModalOpen(false);
    },
    onError: (error) => showAlert(error.response?.data?.message || 'Creation failed', 'error')
  });

  const updateMutation = useMutation({
    mutationFn: (updatedProduct) => api.put(`/admin/products/${updatedProduct.product_id}`, updatedProduct),
    onSuccess: () => {
      showAlert('Product updated successfully!');
      queryClient.invalidateQueries(['allProductsAdmin']);
      setIsModalOpen(false);
    },
    onError: (error) => showAlert(error.response?.data?.message || 'Update failed', 'error')
  });

  const deleteMutation = useMutation({
    mutationFn: (productId) => api.delete(`/admin/products/${productId}`),
    onSuccess: () => {
      showAlert('Product deleted successfully!');
      queryClient.invalidateQueries(['allProductsAdmin']);
    },
    onError: (error) => showAlert(error.response?.data?.message || 'Deletion failed', 'error')
  });

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(productId);
    }
  };

  const handleOpenModal = (product = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editingProduct) {
      updateMutation.mutate({ ...data, product_id: editingProduct.product_id });
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) return <Loader />;
  if (isError) return <p>Error fetching products.</p>;

  return (
    <>
      {isModalOpen && <ProductForm product={editingProduct} onSubmit={handleFormSubmit} onCancel={() => setIsModalOpen(false)} />}
      <div className="container mx-auto mt-10 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Manage Products</h1>
          <button onClick={() => handleOpenModal()} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Add New Product
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left border-b border-gray-300">Actions</th>
                <th className="py-3 px-4 text-left border-b border-gray-300">Name</th>
                <th className="py-3 px-4 text-left border-b border-gray-300">Product ID</th>
                <th className="py-3 px-4 text-left border-b border-gray-300">Price</th>
                <th className="py-3 px-4 text-left border-b border-gray-300">Stock</th>
                <th className="py-3 px-4 text-left border-b border-gray-300">Category</th>
                <th className="py-3 px-4 text-left border-b border-gray-300">Subcategory</th>
                <th className="py-3 px-4 text-left border-b border-gray-300">Category ID</th>
                <th className="py-3 px-4 text-left border-b border-gray-300">Subcategory ID</th>
                <th className="py-3 px-4 text-left border-b border-gray-300">Description</th>
                <th className="py-3 px-4 text-left border-b border-gray-300">Image URL</th>
                <th className="py-3 px-4 text-left border-b border-gray-300">Recommendation Gender</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {products?.map(product => (
                <tr key={product.product_id} className="border-b border-gray-300">
                  <td className="py-3 px-4 border-r border-gray-300">
                    <button onClick={() => handleOpenModal(product)} className="text-blue-500 hover:underline mr-4">Edit</button>
                    <button onClick={() => handleDelete(product.product_id)} className="text-red-500 hover:underline">Delete</button>
                  </td>
                  <td className="py-3 px-4 border-r border-gray-300">{product.product_name}</td>
                  <td className="py-3 px-4 border-r border-gray-300">{product.product_id}</td>
                  <td className="py-3 px-4 border-r border-gray-300">${product.product_price}</td>
                  <td className="py-3 px-4 border-r border-gray-300">{product.product_stock_quantity}</td>
                  <td className="py-3 px-4 border-r border-gray-300">{product.category_name}</td>
                  <td className="py-3 px-4 border-r border-gray-300">{product.subcategory_name}</td>
                  <td className="py-3 px-4 border-r border-gray-300">{product.category_id}</td>
                  <td className="py-3 px-4 border-r border-gray-300">{product.subcategory_id}</td>
                  <td className="py-3 px-4 border-r border-gray-300">{product.product_description}</td>
                  <td className="py-3 px-4 border-r border-gray-300">{product.category_image_url}</td>
                  <td className="py-3 px-4 border-r border-gray-300">{product.customer_gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;