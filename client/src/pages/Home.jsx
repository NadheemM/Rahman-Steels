import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home">
            <section className="hero-section">
                <div className="container hero-container fade-in">
                    <h1 className="hero-title">
                        Build Stronger with <br />
                        <span className="text-accent gradient-text">Rahman Steels</span>
                    </h1>
                    <p className="hero-subtitle">
                        Your trusted partner for high-quality TMT bars, rods, sheets, and pipes.
                        Direct from the best manufacturers to your construction site.
                    </p>
                    <div className="hero-btns">
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Browse Inventory
                        </Link>
                        <Link to="/contact" className="btn btn-outline btn-lg">
                            Contact Us
                        </Link>
                    </div>
                </div>
                <div className="hero-bg-glow"></div>
            </section>

            <section className="features-section container">
                <h2 className="section-title">Our Premium Products</h2>
                <div className="features-grid">
                    <Link to="/products?category=tmt" className="feature-card card category-card">
                        <div className="card-image-container">
                            <img src="/images/tmt-bars.png" alt="TMT Bars" className="card-image" />
                        </div>
                        <div className="card-content">
                            <h3>TMT Bars</h3>
                            <p>High-strength TMT bars for superior construction stability.</p>
                        </div>
                    </Link>
                    <Link to="/products?category=pipes" className="feature-card card category-card">
                        <div className="card-image-container">
                            <img src="/images/steel-pipes.png" alt="Steel Pipes" className="card-image" />
                        </div>
                        <div className="card-content">
                            <h3>Steel Pipes</h3>
                            <p>Durable cylindrical pipes for industrial and plumbing use.</p>
                        </div>
                    </Link>
                    <Link to="/products?category=sheets" className="feature-card card category-card">
                        <div className="card-image-container">
                            <img src="/images/metal-sheets.png" alt="Metal Sheets" className="card-image" />
                        </div>
                        <div className="card-content">
                            <h3>Sheets & Coils</h3>
                            <p>Premium galvanized sheets and coils for diverse applications.</p>
                        </div>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
