'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, FulfillmentType, PaymentMethod } from '../types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  fulfillmentType: FulfillmentType;
  setFulfillmentType: (type: FulfillmentType) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [fulfillmentType, setFulfillmentTypeState] = useState<FulfillmentType>('delivery');
  const [paymentMethod, setPaymentMethodState] = useState<PaymentMethod>('COD');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Restore cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('restaurant_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
      const savedFulfillment = localStorage.getItem('restaurant_fulfillment') as FulfillmentType;
      if (savedFulfillment && ['delivery', 'pickup'].includes(savedFulfillment)) {
        setFulfillmentTypeState(savedFulfillment);
        setPaymentMethodState(savedFulfillment === 'delivery' ? 'COD' : 'Pay at Restaurant');
      }
    } catch {
      // LocalStorage error fallback
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('restaurant_cart', JSON.stringify(items));
        localStorage.setItem('restaurant_fulfillment', fulfillmentType);
      } catch {
        // LocalStorage fallback
      }
    }
  }, [items, fulfillmentType, isInitialized]);

  const setFulfillmentType = (type: FulfillmentType) => {
    setFulfillmentTypeState(type);
    // Keep payment method in sync with required offline rules
    if (type === 'delivery') {
      setPaymentMethodState('COD');
    } else {
      setPaymentMethodState('Pay at Restaurant');
    }
  };

  const setPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethodState(method);
  };

  const addItem = (item: MenuItem, quantity = 1) => {
    setItems((prevItems) => {
      const existing = prevItems.find((i) => i.item._id === item._id);
      if (existing) {
        return prevItems.map((i) =>
          i.item._id === item._id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prevItems, { item, quantity }];
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.item._id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((i) => (i.item._id === itemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const rawSubtotal = items.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const subtotal = Number(rawSubtotal.toFixed(2));
  const deliveryFee = fulfillmentType === 'delivery' && items.length > 0 ? 5.0 : 0.0;
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + deliveryFee + tax).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        fulfillmentType,
        setFulfillmentType,
        paymentMethod,
        setPaymentMethod,
        itemCount,
        subtotal,
        deliveryFee,
        tax,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
