import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa';
import './Cart.css';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const gstRate = 0.18;
    const gstAmount = cartTotal * gstRate;
    const grandTotal = cartTotal + gstAmount;

    if (cart.length === 0) {
        return (
            <div className="container empty-cart-container">
                <h2>Your Cart is Empty</h2>
                <p>Looks like you haven't added any steel products yet.</p>
                <Link to="/products" className="btn btn-primary">
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="container cart-page">
            <h1 className="page-title">Shopping Cart</h1>

            <div className="cart-content">
                <div className="cart-items">
                    {cart.map((item) => (
                        <div key={item.id} className="cart-item card">
                            <div className="cart-item-image">
                                <img src={item.image} alt={item.name} />
                            </div>
                            <div className="cart-item-details">
                                <h3>{item.name}</h3>
                                <p className="item-category">{item.category}</p>
                                <div className="item-price">₹{item.price} / {item.unit}</div>
                            </div>

                            <div className="cart-item-actions">
                                <div className="quantity-controls">
                                    <button
                                        className="qty-btn"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        <FaMinus />
                                    </button>
                                    <span className="qty-value">{item.quantity}</span>
                                    <button
                                        className="qty-btn"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        <FaPlus />
                                    </button>
                                </div>
                                <div className="item-subtotal">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                </div>
                                <button
                                    className="remove-btn"
                                    onClick={() => removeFromCart(item.id)}
                                    title="Remove Item"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="cart-actions-row">
                        <Link to="/products" className="btn btn-outline">
                            <FaArrowLeft /> Continue Shopping
                        </Link>
                        <button className="btn btn-outline danger-btn" onClick={clearCart}>
                            Clear Cart
                        </button>
                    </div>
                </div>

                <div className="cart-summary card">
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>GST (18%)</span>
                        <span>₹{gstAmount.toFixed(2)}</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row total-row">
                        <span>Total</span>
                        <span>₹{grandTotal.toFixed(2)}</span>
                    </div>
                    <button className="btn btn-primary checkout-btn" onClick={() => alert('Checkout functionality processed!')}>
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
