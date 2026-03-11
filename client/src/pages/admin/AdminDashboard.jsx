import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [steelPrices, setSteelPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Tab state: 'products' | 'prices'
  const [activeTab, setActiveTab] = useState('products');

  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    } else {
      fetchData();
    }
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, pricesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products'),
        axios.get('http://localhost:5000/api/steel-prices')
      ]);
      setProducts(productsRes.data.data);
      setSteelPrices(pricesRes.data.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching dashboard data');
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting product');
      }
    }
  };

  const deletePriceTier = async (id) => {
    if (window.confirm('Are you sure you want to delete this price tier?')) {
      try {
        await axios.delete(`http://localhost:5000/api/steel-prices/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting price tier');
      }
    }
  };

  if (loading) return <div className="admin-loading">Loading Dashboard...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        {activeTab === 'products' ? (
            <Link to="/admin/products/add" className="btn-add-product">+ Add Product</Link>
        ) : (
            <Link to="/admin/prices/add" className="btn-add-product">+ Add Price Tier</Link>
        )}
      </div>

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Manage Products
        </button>
        <button 
          className={`admin-tab ${activeTab === 'prices' ? 'active' : ''}`}
          onClick={() => setActiveTab('prices')}
        >
          Manage Steel Prices
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'products' && (
          <div className="admin-product-list">
            {products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>In Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <td>
                        <img src={product.image} alt={product.name} className="admin-prod-img" />
                      </td>
                      <td>{product.name}</td>
                      <td>₹{product.price}</td>
                      <td>{product.category}</td>
                      <td>{product.inStock ? 'Yes' : 'No'}</td>
                      <td className="admin-actions">
                        <Link to={`/admin/products/edit/${product._id}`} className="btn-edit">Edit</Link>
                        <button onClick={() => deleteProduct(product._id)} className="btn-delete">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'prices' && (
          <div className="admin-product-list">
            {steelPrices.length === 0 ? (
              <p>No steel prices found.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Thickness (mm)</th>
                    <th>Weight (Kg/m)</th>
                    <th>Tolerance</th>
                    <th>Price/Ton (₹)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {steelPrices.map(tier => (
                    <tr key={tier._id}>
                      <td>{tier.thickness}</td>
                      <td>{tier.nominalWeight}</td>
                      <td>{tier.tolerance}</td>
                      <td><strong>₹{tier.pricePerTon}</strong></td>
                      <td className="admin-actions">
                        <Link to={`/admin/prices/edit/${tier._id}`} className="btn-edit">Edit</Link>
                        <button onClick={() => deletePriceTier(tier._id)} className="btn-delete">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
