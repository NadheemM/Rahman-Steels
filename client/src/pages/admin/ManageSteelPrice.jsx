import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const ManageSteelPrice = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    thickness: '',
    nominalWeight: '',
    tolerance: '',
    pricePerTon: '',
    brand: 'AGNI',
    category: 'TMT Bars'
  });
  const [loading, setLoading] = useState(false);
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
      fetchPriceTier();
    }
  }, [user, navigate, id, isEditMode]);

  const fetchPriceTier = async () => {
    try {
      setLoading(true);
      // Wait for the full list to find our specific tier (simplest approach for now)
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/steel-prices`);
      const tier = res.data.data.find(p => p._id === id);
      
      if (tier) {
        setFormData({
          thickness: tier.thickness,
          nominalWeight: tier.nominalWeight,
          tolerance: tier.tolerance,
          pricePerTon: tier.pricePerTon,
          brand: tier.brand,
          category: tier.category
        });
      } else {
        setError("Price tier not found");
      }
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching price details');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
        await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/steel-prices/${id}`, formData, config);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/steel-prices`, formData, config);
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving price tier');
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading">Loading price details...</div>;

  return (
    <div className="manage-product-container">
      <Link to="/admin/dashboard" className="admin-back-link">← Back to Dashboard</Link>
      <h1>{isEditMode ? 'Edit Steel Price Tier' : 'Add New Steel Price Tier'}</h1>
      
      {error && <div className="admin-error">{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-group">
          <label htmlFor="thickness">Thickness (mm)</label>
          <input
            type="number"
            id="thickness"
            name="thickness"
            value={formData.thickness}
            onChange={handleChange}
            required
            min="0"
            step="0.1"
            placeholder="e.g. 8"
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="nominalWeight">Nominal Weight (Kg/metre)</label>
          <input
            type="number"
            id="nominalWeight"
            name="nominalWeight"
            value={formData.nominalWeight}
            onChange={handleChange}
            required
            min="0"
            step="0.001"
            placeholder="e.g. 0.395"
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="tolerance">Tolerance (Kg/metre)</label>
          <input
            type="text"
            id="tolerance"
            name="tolerance"
            value={formData.tolerance}
            onChange={handleChange}
            required
            placeholder="e.g. 0.363-0.423"
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="pricePerTon">Price/Ton (₹)</label>
          <input
            type="number"
            id="pricePerTon"
            name="pricePerTon"
            value={formData.pricePerTon}
            onChange={handleChange}
            required
            min="0"
            step="1"
            placeholder="e.g. 75340"
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="brand">Brand</label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
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
          />
        </div>

        <button type="submit" className="btn-submit" disabled={saving}>
          {saving ? 'Saving...' : (isEditMode ? 'Update Price Tier' : 'Add Price Tier')}
        </button>
      </form>
    </div>
  );
};

export default ManageSteelPrice;
