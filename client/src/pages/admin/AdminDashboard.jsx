import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [steelPrices, setSteelPrices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Tab state: 'dashboard' | 'products' | 'prices' | 'orders'
  const [activeTab, setActiveTab] = useState('dashboard');

  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    } else if (token) {
      fetchData();
    }
  }, [user, token, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, productsRes, pricesRes, ordersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/products'),
        axios.get('http://localhost:5000/api/steel-prices'),
        axios.get('http://localhost:5000/api/payments/admin/all', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setStats(statsRes.data.data);
      setProducts(productsRes.data.data);
      setSteelPrices(pricesRes.data.data);
      setOrders(ordersRes.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Dashboard Error:', err);
      setError(`Error fetching dashboard data: ${err.message} - ${err.response?.data?.message || ''}`);
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

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/payments/admin/${id}/status`, { orderStatus: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update local state without re-fetching all data
      setOrders(orders.map(order => order._id === id ? { ...order, orderStatus: newStatus } : order));
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating order status');
    }
  };

  if (loading) return <div className="admin-loading">Loading Dashboard...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Control Panel</h1>
        <div>
          {activeTab === 'products' && <Link to="/admin/products/add" className="btn-add-product">+ Add Product</Link>}
          {activeTab === 'prices' && <Link to="/admin/prices/add" className="btn-add-product">+ Add Price Tier</Link>}
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard Overview
        </button>
        <button 
          className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Product Management
        </button>
        <button 
          className={`admin-tab ${activeTab === 'prices' ? 'active' : ''}`}
          onClick={() => setActiveTab('prices')}
        >
          Steel Prices
        </button>
        <button 
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Order Management
        </button>
      </div>
      
      <div className="admin-content">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && stats && (
          <div className="admin-stats-grid">
            <div className="stat-card">
              <h3>Total Orders</h3>
              <p className="stat-value">{stats.totalOrders}</p>
            </div>
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <p className="stat-value">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="stat-card">
              <h3>Total Products</h3>
              <p className="stat-value">{stats.totalProducts}</p>
            </div>
            <div className="stat-card warning">
              <h3>Out of Stock</h3>
              <p className="stat-value">{stats.outOfStock}</p>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
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
                      <td>{product.inStock ? 'Yes' : <span style={{color:'red'}}>No</span>}</td>
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

        {/* STEEL PRICES TAB */}
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

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="admin-product-list">
            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <div className="orders-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID / Date</th>
                      <th>Customer Details</th>
                      <th>Items & Amount</th>
                      <th>Payment Status</th>
                      <th>Order Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td>
                          <strong>{order.razorpay_order_id}</strong><br/>
                          <span style={{fontSize: '12px', color: '#666'}}>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td>
                          {order.user?.name || order.shippingAddress.name} <br/>
                          <span style={{fontSize: '12px', color: '#666'}}>{order.user?.email || order.shippingAddress.email}</span> <br/>
                          <span style={{fontSize: '12px', color: '#666'}}>{order.shippingAddress.city}, {order.shippingAddress.state}</span>
                        </td>
                        <td>
                          {order.cartItems.length} items <br/>
                          <strong>₹{order.amount}</strong>
                        </td>
                        <td>
                          <span className={`status-badge payment-${order.status}`}>
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <select 
                            value={order.orderStatus} 
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className={`status-select ${order.orderStatus.toLowerCase()}`}
                            disabled={order.status !== 'captured'}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
