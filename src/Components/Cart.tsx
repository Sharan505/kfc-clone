import React from 'react';
import { X, Minus, Plus, Trash2, ShoppingCart, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Contexts/CartContext';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { 
        cartItems, 
        updateQuantity, 
        removeFromCart,
        getCartTotal,
        getCartCount
    } = useCart();
    
    if (!isOpen) return null;
    
    const subtotal = getCartTotal();
    const gst = subtotal * 0.03;
    const convenienceFee = 20;
    const deliveryFee = cartItems.length > 0 ? 40 : 0;
    const total = subtotal + gst + convenienceFee + deliveryFee;

    const handleQuantityChange = (id: string, newQuantity: number) => {
        updateQuantity(id, Math.max(1, newQuantity));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-4/5 h-4/5 rounded-lg overflow-hidden flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <ShoppingBag className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Your Cart ({getCartCount()})</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close cart"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center mt-10 space-y-4 text-gray-500">
                            <ShoppingCart className="w-16 h-16 text-gray-300" />
                            <p className="text-lg">Your cart is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex justify-between items-center p-4 border rounded-lg">
                                    <div>
                                        <h3 className="font-semibold">{item.title}</h3>
                                        <p className="text-gray-600">₹{item.amount}</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => removeFromCart(item._id)}
                                            className="ml-4 text-red-500 px-4 hover:text-red-700 flex items-center space-x-2 transition-colors"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="border-t p-4">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>GST (3%):</span>
                                <span>₹{gst.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Convenience Fee:</span>
                                <span>₹{convenienceFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Fee:</span>
                                <span>{deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : 'Free'}</span>
                            </div>
                            <div className="border-t pt-2 mt-2 font-bold flex justify-between">
                                <span>Total:</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button 
                            className="w-full bg-red-600 text-white py-3 rounded-lg mt-4 hover:bg-red-700 flex items-center justify-center space-x-2 transition-colors" 
                            onClick={() => { 
                                onClose();
                                navigate('/checkout');
                            }}
                        >
                            <span>Proceed to Checkout</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;