import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pricing.css';

const Pricing = () => {
  const [steelPrices, setSteelPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/steel-prices`);
        setSteelPrices(res.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch pricing data');
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  if (loading) return <div className="pricing-page container" style={{ paddingTop: '5rem', textAlign: 'center' }}><h2>Loading prices...</h2></div>;
  if (error) return <div className="pricing-page container" style={{ paddingTop: '5rem', textAlign: 'center', color: 'red' }}><h2>{error}</h2></div>;

  return (
    <div className="pricing-page">
      <div className="container" style={{ paddingTop: '2rem' }}>
        <h2 className="pricing-sub-title" style={{ marginTop: 0 }}>TMT bars price</h2>
        
        <p className="pricing-summary-text">
          Here is a summary of our TMT steel price concerning bar tolerance and nominal weight.
        </p>

        <p className="pricing-details-text">
          Apart from the standard length of 12.20m (40 feet), we have 13.72m, 15.24m, 16.76m, 18.29m, & 20.06m lengths
          (40, 45, 50, 55, 60, up to 65 feet) available according to your requirements.
        </p>



        <div className="pricing-table-container">
          <table className="pricing-table">
            <thead>
              <tr>
                <th>Thickness<br/><span className="th-sub">(mm)</span></th>
                <th>Nominal Weight<br/><span className="th-sub">(Kg/metre)</span></th>
                <th>Tolerance<br/><span className="th-sub">(Kg/metre)</span></th>
                <th>Price/Ton*<br/><span className="th-sub">(inc GST/ Excl. Freight)</span></th>
              </tr>
            </thead>
            <tbody>
              {steelPrices.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No price data available.</td>
                </tr>
              ) : (
                steelPrices.map(tier => (
                  <tr key={tier._id}>
                    <td>{tier.thickness}</td>
                    <td>{tier.nominalWeight}</td>
                    <td>{tier.tolerance}</td>
                    <td>₹ {tier.pricePerTon}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
