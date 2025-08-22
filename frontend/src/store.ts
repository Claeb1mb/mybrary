import { create } from 'zustand';
import { CartItem, Book } from './types';

interface CartStore {
  items: CartItem[];
  addItem: (book: Book, quantity: number) => void;
  removeItem: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (book: Book, quantity: number) => set((state) => {
    const existingItem = state.items.find(item => item.book.id === book.id);
    if (existingItem) {
      return {
        items: state.items.map(item =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      };
    }
    return { items: [...state.items, { book, quantity }] };
  }),

  removeItem: (bookId: number) => set((state) => ({
    items: state.items.filter(item => item.book.id !== bookId)
  })),

  updateQuantity: (bookId: number, quantity: number) => set((state) => ({
    items: quantity <= 0
      ? state.items.filter(item => item.book.id !== bookId)
      : state.items.map(item =>
          item.book.id === bookId ? { ...item, quantity } : item
        )
  })),

  clearCart: () => set({ items: [] }),

  getTotalItems: () => {
    const state = get();
    return state.items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    const state = get();
    return state.items.reduce((total, item) =>
      total + (parseFloat(item.book.price) * item.quantity), 0
    );
  }
}));
