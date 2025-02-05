import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define types for the cart and product
interface Product {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartContextType {
    cart: Product[];
    addToCart: (product: Omit<Product, 'quantity'>) => void;
    removeFromCart: (productId: string) => void;
    resetCart: () => void;  // Method to reset the cart
}

// Create the Cart context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create a CartProvider component to wrap the app
interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<Product[]>([]);

    const addToCart = (product: Omit<Product, 'quantity'>) => {
        const existingProduct = cart.find(item => item.id === product.id);

        if (existingProduct) {
            setCart(cart.map(item =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId: string) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    // Reset the cart (clear all items)
    const resetCart = () => {
        setCart([]);  // Clears the cart
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, resetCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Create a custom hook to use the cart context
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
