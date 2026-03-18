import React from 'react';
import './About.css';
import { FaBuilding, FaHardHat, FaHandshake, FaAward } from 'react-icons/fa';

const About = () => {
    return (
        <div className="about-page fade-in">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="about-hero-overlay"></div>
                <div className="container about-hero-content">
                    <h1 className="hero-title">Crafting Dreams into <span className="text-accent">Reality</span></h1>
                    <p className="hero-subtitle">
                        Transforming construction projects with premium steel products that combine durability with ultimate flexibility.
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="about-story container section-padding">
                <div className="story-content" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 className="section-title">Our <span className="text-accent">Story</span></h2>
                    <p className="lead-text">
                        Founded with a vision to build structures that endure, Rahman Steels has grown into a leading provider of high-quality steel products for construction, industrial, and architectural needs.
                    </p>
                    <p>
                        We believe that the foundation of any great structure lies in the materials it's built with. That's why we source and supply only the finest quality steel, ensuring every product meets rigorous industry standards. From residential projects to massive industrial complexes, our steel has been the backbone of countless success stories.
                    </p>
                    <p>
                        Our commitment goes beyond just selling steel. We partner with builders, engineers, and visionaries to provide tailored solutions, expert advice, and unwavering support throughout every phase of the project.
                    </p>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="core-values-section bg-secondary section-padding">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="section-title">Our Core <span className="text-accent">Values</span></h2>
                        <p className="section-subtitle">The principles that guide everything we do</p>
                    </div>
                    <div className="values-grid">
                        <div className="value-card card">
                            <div className="value-icon"><FaAward /></div>
                            <h3>Uncompromising Quality</h3>
                            <p>We supply only the highest-grade steel products that exceed safety and durability standards. Quality is not an option; it's our promise.</p>
                        </div>
                        <div className="value-card card">
                            <div className="value-icon"><FaHandshake /></div>
                            <h3>Integrity & Trust</h3>
                            <p>We build relationships on transparency and honesty. Our clients trust us because we deliver on our commitments every single time.</p>
                        </div>
                        <div className="value-card card">
                            <div className="value-icon"><FaBuilding /></div>
                            <h3>Innovation & Growth</h3>
                            <p>We stay ahead of the curve by embracing modern supply chain technologies and offering advanced steel solutions for complex designs.</p>
                        </div>
                        <div className="value-card card">
                            <div className="value-icon"><FaHardHat /></div>
                            <h3>Safety First</h3>
                            <p>The safety of the structures built with our steel, and the workers who build them, is always our top priority. Reliable steel saves lives.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Connect Section */}
            <section className="about-connect container section-padding">
                <div className="connect-card glass">
                    <div className="connect-content">
                        <h2>Ready to Build with the Best?</h2>
                        <p>Whether you're planning a massive commercial project or a robust residential build, we have the steel you need.</p>
                        <div className="connect-actions">
                            <a href="/products" className="btn btn-primary">Explore Products</a>
                            <a href="/pricing" className="btn btn-outline">Check Live Prices</a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
