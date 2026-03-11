import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './Products.css';

const Products = () => {
    const { addToCart } = useCart();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get('category');
    const searchParam = queryParams.get('search');

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Simple mapping from URL param to Product Category string
    const categoryMap = {
        'tmt': 'TMT Bars',
        'pipes': 'Steel Pipes',
        'sheets': 'Sheets & Coils'
    };

    const initialCategory = categoryMap[categoryParam] || 'all';
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [searchTerm, setSearchTerm] = useState(searchParam || '');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/products');
            setProducts(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleAddToCart = (product) => {
        addToCart({
            ...product,
            id: product._id // Map _id to id for the cart
        });
        alert(`${product.name} added to cart!`);
    };

    // Get unique categories for the dropdown
    const categories = ['all', ...new Set(products.map(p => p.category))];

    if (loading) {
        return <div className="product-page" style={{ paddingTop: '5rem', textAlign: 'center' }}><h2>Loading products...</h2></div>;
    }

    return (
        <div className="product-page">
            <div className="container" style={{ paddingTop: '2rem' }}>
                <h1 className="page-title">Our Products</h1>

                <div className="filter-bar glass">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="category-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat === 'all' ? 'All Categories' : cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="products-grid">
                    {filteredProducts.map(product => (
                        <div key={product._id} className="product-card card">
                            <div className="product-image-box">
                                <img src={product.image} alt={product.name} />
                            </div>
                            <div className="product-info">
                                <div className="product-cat">{product.category}</div>
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-desc">{product.description}</p>
                                <div className="product-price">₹{product.price}</div>
                                <button
                                    className="btn btn-primary addToCart-btn"
                                    onClick={() => handleAddToCart(product)}
                                    disabled={!product.inStock}
                                >
                                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredProducts.length === 0 && (
                        <div className="no-products">
                            <p>No products found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;
