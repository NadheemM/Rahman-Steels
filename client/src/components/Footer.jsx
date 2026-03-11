import React from 'react';
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
    return (
        <footer className="footer-section">
            <div className="container footer-grid">
                {/* About Us */}
                <div className="footer-col about-col">
                    <h3 className="footer-title">About Us</h3>
                    <p className="footer-text">
                        Transform your construction projects with premium steel products that combine
                        durability with flexibility. Crafted for structures that endure.
                    </p>
                    <div className="social-links">
                        <h4 className="follow-us">Follow Us</h4>
                        <div className="social-icons">
                            <a href="#" className="social-icon"><FaFacebook /></a>
                            <a href="#" className="social-icon"><FaInstagram /></a>
                            <a href="#" className="social-icon"><FaTwitter /></a>
                            <a href="#" className="social-icon"><FaLinkedin /></a>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer-col links-col">
                    <h3 className="footer-title">Quick Links</h3>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
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
                            <p>123 Steel Market, Chennai, Tamil Nadu, India - 600001</p>
                        </div>
                    </div>
                    <div className="contact-item">
                        <div className="icon-box"><FaPhoneAlt /></div>
                        <div className="contact-info">
                            <p>+91 98765 43210</p>
                        </div>
                    </div>
                    <div className="contact-item">
                        <div className="icon-box"><FaEnvelope /></div>
                        <div className="contact-info">
                            <p>info@rahmansteels.com</p>
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
                        <div className="status-badge open">
                            <span className="dot"></span> Currently Open
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
                        <div className="map-placeholder">
                            <button className="btn btn-outline btn-sm">View larger map</button>
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
