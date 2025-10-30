"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import toast from 'react-hot-toast';

// 1. Definimos los tipos de datos
interface CartItem {
  id: string;       // ID del Producto
  nombre: string;
  slug: string;
  imageUrl: string;
  precio: number;   // Guardaremos el precio como número
  talla: string;
  color: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  clearCart: () => void;
  removeFromCart: (id: string, talla: string, color: string) => void;
  itemCount: number;
  // (Aquí podríamos añadir 'removeFromCart', 'updateQuantity', etc.)
}

// 2. Creamos el Contexto
export const CartContext = createContext<CartContextType | undefined>(undefined);

// 3. Creamos el "Proveedor" (el componente que envuelve la app)
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // 4. Cargar el carrito desde LocalStorage al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem('tworld-cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // 5. Guardar el carrito en LocalStorage CADA VEZ que cambie
  useEffect(() => {
    localStorage.setItem('tworld-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 6. Lógica para AÑADIR AL CARRITO
  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    // Usamos 'setCartItems' con una función para asegurar que 'cartItems' esté actualizado
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        cartItem => 
          cartItem.id === item.id &&
          cartItem.talla === item.talla &&
          cartItem.color === item.color
      );

      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id &&
          cartItem.talla === item.talla &&
          cartItem.color === item.color
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
    
    toast.success("¡Agregado al carrito!");
  }, []);
  
  const clearCart = useCallback(() => {
    setCartItems([]); 
    toast.success("¡Pago exitoso! Gracias por tu compra.");
    // No tiene dependencias
  }, []);

  const removeFromCart = useCallback((id: string, talla: string, color: string) => {
    setCartItems(currentItems =>
      currentItems.filter(item =>
        !(item.id === id && item.talla === talla && item.color === color)
      )
    );
    toast.error("Item eliminado del carrito");
  }, []);

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, itemCount, addToCart, clearCart, removeFromCart}}> {/* 3. AÑADE clearCart AQUÍ */}
      {children}
    </CartContext.Provider>
  );
}

// 7. Hook personalizado para usar el contexto (más fácil)
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}