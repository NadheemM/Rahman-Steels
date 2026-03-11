import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const ManageProduct = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    inStock: true
  });
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }

    if (isEditMode) {
      fetchProduct();
    }
  }, [user, navigate, id, isEditMode]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      setFormData({
        name: res.data.data.name,
        description: res.data.data.description,
        price: res.data.data.price,
        image: res.data.data.image,
        category: res.data.data.category,
        inStock: res.data.data.inStock
      });
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching product details');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/products/${id}`, formData, config);
      } else {
        await axios.post('http://localhost:5000/api/products', formData, config);
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving product');
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading product details...</div>;

  return (
    <div className="manage-product-container">
      <Link to="/admin/dashboard" className="admin-back-link">← Back to Dashboard</Link>
      <h1>{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
      
      {error && <div className="admin-error">{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. Smart Neon LED Rope"
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="price">Price (₹)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            placeholder="e.g. Electronics, Lighting"
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="image">Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
            placeholder="https://example.com/image.jpg"
          />
          {formData.image && (
            <div style={{marginTop: '10px'}}>
              <p style={{fontSize: '12px', marginBottom: '5px'}}>Preview:</p>
              <img src={formData.image} alt="Preview" style={{maxWidth: '100px', borderRadius: '4px'}} onError={(e) => { e.target.style.display = 'none' }} />
            </div>
          )}
        </div>

        <div className="admin-form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form-group checkbox-group">
          <input
            type="checkbox"
            id="inStock"
            name="inStock"
            checked={formData.inStock}
            onChange={handleChange}
          />
          <label htmlFor="inStock">In Stock</label>
        </div>

        <button type="submit" className="btn-submit" disabled={saving}>
          {saving ? 'Saving...' : (isEditMode ? 'Update Product' : 'Add Product')}
        </button>
      </form>
    </div>
  );
};

export default ManageProduct;
