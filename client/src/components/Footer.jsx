import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FaFacebook,
    FaInstagram,
    FaTwitter,
    FaLinkedin,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaClock,
    FaCommentDots
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    const [isShopOpen, setIsShopOpen] = useState(false);

    useEffect(() => {
        const checkOpenStatus = () => {
            const now = new Date();
            const day = now.getDay(); // 0 = Sunday, 1 = Monday...
            const hour = now.getHours();
            
            // Open Mon - Sat (1-6), 9 AM (9) to 8 PM (19:59)
            if (day >= 1 && day <= 6 && hour >= 9 && hour < 20) {
                setIsShopOpen(true);
            } else {
                setIsShopOpen(false);
            }
        };

        checkOpenStatus();
        const interval = setInterval(checkOpenStatus, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="footer-section">
            <div className="container footer-grid">
                {/* Quick Links */}
                <div className="footer-col links-col">
                    <h3 className="footer-title">Quick Links</h3>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/products">Collection</Link></li>
                        <li><Link to="/cart">Cart</Link></li>
                        <li><Link to="/login">My Orders</Link></li>
                    </ul>
                </div>

                {/* Contact Us */}
                <div className="footer-col contact-col">
                    <h3 className="footer-title">Contact Us</h3>
                    <div className="contact-item">
                        <div className="icon-box"><FaMapMarkerAlt /></div>
                        <div className="contact-info">
                            <h4>Rahman Steels</h4>
                            <p>No 3, Sub-Jail Road, Palakkarai, Trichy-8.</p>
                        </div>
                    </div>
                    <div className="contact-item">
                        <div className="icon-box"><FaPhoneAlt /></div>
                        <div className="contact-info">
                            <p>+91 98940 21653</p>
                        </div>
                    </div>
                    <div className="contact-item">
                        <div className="icon-box"><FaEnvelope /></div>
                        <div className="contact-info">
                            <p>rahman.jahirhusain1977@gmail.com</p>
                        </div>
                    </div>
                </div>

                {/* Business Hours */}
                <div className="footer-col hours-col">
                    <h3 className="footer-title">Business Hours</h3>
                    <div className="hours-card card">
                        <div className="hours-header">
                            <div className="hours-icon"><FaClock /></div>
                            <h4>Opening Times</h4>
                        </div>
                        <div className="hours-list">
                            <div className="hours-row">
                                <span>Mon - Sat</span>
                                <span>9 AM - 8 PM</span>
                            </div>
                            <div className="hours-row">
                                <span>Sunday</span>
                                <span>Closed</span>
                            </div>
                        </div>
                        <div className={`status-badge ${isShopOpen ? 'open' : 'closed'}`}>
                            <span className={`dot ${isShopOpen ? 'open' : 'closed'}`}></span> {isShopOpen ? 'Currently Open' : 'Currently Closed'}
                        </div>
                    </div>
                </div>

                {/* Find Us */}
                <div className="footer-col map-col">
                    <h3 className="footer-title">Find Us</h3>
                    <div className="map-card card">
                        <div className="map-header">
                            <div className="map-icon"><FaMapMarkerAlt /></div>
                            <h4>Our Location</h4>
                        </div>
                        <div className="map-placeholder" style={{ height: 'auto', display: 'block', backgroundColor: 'transparent', padding: 0 }}>
                            <iframe 
                                title="Rahman Steels Location"
                                src="https://www.google.com/maps/embed?pb=!4v1773424846846!6m8!1m7!1sVqye0C7FLYuwFVBsKKTzQQ!2m2!1d10.81251792989514!2d78.69597652226054!3f356.42469382947826!4f-7.083248862076331!5f0.7820865974627469" 
                                width="100%" 
                                height="200" 
                                style={{ border: 0, borderRadius: '8px' }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container bottom-content">
                    <p>&copy; 2026 Rahman Steels. All rights reserved. <br />Crafting dreams into reality.</p>
                    <div className="bottom-links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/return">Return Policy</Link>
                    </div>
                </div>
            </div>


        </footer>
    );
};

export default Footer;
