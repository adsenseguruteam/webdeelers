"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface CartItem {
	_id: string;
	title: string;
	price: number;
	comparePrice?: number;
	currency: string;
	thumbnail?: string;
	category: string;
	slug: string;
}

interface CartContextType {
	cart: CartItem[];
	addToCart: (item: CartItem) => void;
	removeFromCart: (productId: string) => void;
	clearCart: () => void;
	isInCart: (productId: string) => boolean;
	getCartTotal: () => number;
	itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [cart, setCart] = useState<CartItem[]>([]);
	const [isInitialized, setIsInitialized] = useState(false);

	// Load cart from localStorage on mount
	useEffect(() => {
		const savedCart = localStorage.getItem("deelzo_cart");
		if (savedCart) {
			try {
				setCart(JSON.parse(savedCart));
			} catch (e) {
				console.error("Failed to parse cart from localStorage", e);
			}
		}
		setIsInitialized(true);
	}, []);

	// Save cart to localStorage on change
	useEffect(() => {
		if (isInitialized) {
			localStorage.setItem("deelzo_cart", JSON.stringify(cart));
		}
	}, [cart, isInitialized]);

	const addToCart = (item: CartItem) => {
		setCart((prevCart) => {
			const existingItem = prevCart.find((i) => i._id === item._id);
			if (existingItem) {
				toast.info("Item is already in your cart");
				return prevCart;
			}
			toast.success(`${item.title} added to cart!`);
			return [...prevCart, item];
		});
	};

	const removeFromCart = (productId: string) => {
		setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
		toast.success("Item removed from cart");
	};

	const clearCart = () => {
		setCart([]);
	};

	const isInCart = (productId: string) => {
		return cart.some((item) => item._id === productId);
	};

	const getCartTotal = () => {
		return cart.reduce((total, item) => total + item.price, 0);
	};

	return (
		<CartContext.Provider
			value={{
				cart,
				addToCart,
				removeFromCart,
				clearCart,
				isInCart,
				getCartTotal,
				itemCount: cart.length,
			}}>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}
