import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const localData = localStorage.getItem('lumina-cart');
        return localData ? JSON.parse(localData) : [];
    });

    useEffect(() => {
        localStorage.setItem('lumina-cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (book, quantity) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item._id === book._id);
            if (existingItem) {
                return prevCart.map(item =>
                    item._id === book._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevCart, { ...book, quantity }];
        });
    };

    const removeFromCart = (bookId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== bookId));
    };

    const updateQuantity = (bookId, newQuantity) => {
        if (newQuantity < 1) return;
        setCart(prevCart =>
            prevCart.map(item =>
                item._id === bookId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
