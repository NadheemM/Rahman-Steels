import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaShoppingCart, FaUser, FaSun, FaMoon, FaSignOutAlt, FaChevronDown, FaSearch, FaCog } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { cartCount } = useCart();
    const { theme, toggleTheme } = useTheme();
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(!isOpen);
    const toggleProfileMenu = () => setIsProfileOpen(!isProfileOpen);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        setIsProfileOpen(false);
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${searchQuery}`);
        }
    };

    return (
        <nav className="navbar glass">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Rahman <span className="text-accent">Steels</span>
                </Link>

                <div className="menu-icon" onClick={toggleMenu}>
                    {isOpen ? <FaTimes /> : <FaBars />}
                </div>

                <ul className={isOpen ? 'nav-menu active glass' : 'nav-menu'}>
                    <li className="nav-item">
                        <Link to="/" className="nav-links" onClick={toggleMenu}>
                            Home
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/about" className="nav-links" onClick={toggleMenu}>
                            About
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/products" className="nav-links" onClick={toggleMenu}>
                            Products
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/pricing" className="nav-links" onClick={toggleMenu}>
                            Pricing
                        </Link>
                    </li>
                </ul>

                <form className="search-container" onSubmit={handleSearch}>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search products"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="search-btn">
                        <FaSearch />
                    </button>
                </form>

                <div className="nav-right">
                    <Link to="/cart" className="cart-link">
                        <div className="cart-icon-wrapper">
                            <FaShoppingCart />
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </div>
                    </Link>

                    {isAuthenticated ? (
                        <div className="profile-dropdown">
                            <button 
                                className="profile-toggle"
                                onClick={toggleProfileMenu}
                            >
                                <div className="profile-avatar">
                                    <FaUser />
                                </div>
                                <span className="profile-name">{user?.name || user?.email?.split('@')[0]}</span>
                                <FaChevronDown className="dropdown-arrow" />
                            </button>

                            {isProfileOpen && (
                                <div className="profile-menu glass">
                                    <div className="profile-header">
                                        <div className="profile-avatar-large">
                                            <FaUser />
                                        </div>
                                        <div className="profile-info">
                                            <h3>{user?.name}</h3>
                                            <p>{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="profile-divider"></div>
                                    {user?.role === 'admin' && (
                                        <Link 
                                            to="/admin/dashboard" 
                                            className="profile-logout" 
                                            onClick={() => setIsProfileOpen(false)} 
                                            style={{ color: 'var(--text-color)', marginBottom: '5px' }}
                                        >
                                            <FaCog />
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button 
                                        className="profile-logout"
                                        onClick={handleLogout}
                                    >
                                        <FaSignOutAlt />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="nav-btn btn btn-primary login-btn">
                            Login
                        </Link>
                    )}
                    
                    <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
                        {theme === 'light' ? <FaMoon /> : <FaSun />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
