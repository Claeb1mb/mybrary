import { create } from 'zustand';
import { CartItem, Book } from './types';

interface CartStore {
  items: CartItem[];
  addItem: (book: Book, quantity: number) => { success: boolean; message?: string };
  removeItem: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => { success: boolean; message?: string };
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getAvailableStock: (bookId: number) => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (book: Book, quantity: number) => {
    const state = get();
    const existingItem = state.items.find(item => item.book.id === book.id);
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
    const newTotalQuantity = currentQuantityInCart + quantity;

    if (newTotalQuantity > book.stock_qty) {
      const availableToAdd = book.stock_qty - currentQuantityInCart;
      if (availableToAdd <= 0) {
        return { success: false, message: `"${book.title}" is already at maximum stock in your cart` };
      }
      return {
        success: false,
        message: `Only ${availableToAdd} more ${availableToAdd === 1 ? 'copy' : 'copies'} of "${book.title}" can be added`
      };
    }

    set((state) => {
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
    });

    return { success: true };
  },

  removeItem: (bookId: number) => set((state) => ({
    items: state.items.filter(item => item.book.id !== bookId)
  })),

  updateQuantity: (bookId: number, quantity: number) => {
    const state = get();
    const item = state.items.find(item => item.book.id === bookId);

    if (!item) {
      return { success: false, message: 'Item not found in cart' };
    }

    if (quantity <= 0) {
      set((state) => ({
        items: state.items.filter(item => item.book.id !== bookId)
      }));
      return { success: true };
    }

    if (quantity > item.book.stock_qty) {
      return {
        success: false,
        message: `Only ${item.book.stock_qty} ${item.book.stock_qty === 1 ? 'copy' : 'copies'} of "${item.book.title}" available`
      };
    }

    set((state) => ({
      items: state.items.map(item =>
        item.book.id === bookId ? { ...item, quantity } : item
      )
    }));

    return { success: true };
  },

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
  },

  getAvailableStock: (bookId: number) => {
    const state = get();
    const item = state.items.find(item => item.book.id === bookId);
    if (!item) return 0;
    return item.book.stock_qty - item.quantity;
  }
}));
