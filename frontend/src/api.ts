import { Book, Review, Order, OrderItem, Genre } from './types';

const API_BASE = 'http://localhost:3000/api';

export const api = {
  async getBooks(params?: { search?: string; genre?: string; author?: string }): Promise<Book[]> {
    const url = new URL(`${API_BASE}/books`);
    if (params?.search) url.searchParams.append('search', params.search);
    if (params?.genre) url.searchParams.append('genre', params.genre);
    if (params?.author) url.searchParams.append('author', params.author);

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to fetch books');
    return response.json();
  },

  async getGenres(): Promise<Genre[]> {
    const response = await fetch(`${API_BASE}/genres`);
    if (!response.ok) throw new Error('Failed to fetch genres');
    return response.json();
  },

  async getReviews(bookId: number): Promise<Review[]> {
    const response = await fetch(`${API_BASE}/books/${bookId}/reviews`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  },

  async createReview(bookId: number, userId: number, rating: number, content: string): Promise<Review> {
    const response = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        book_id: bookId,
        user_id: userId,
        rating,
        content
      }),
    });
    if (!response.ok) throw new Error('Failed to create review');
    return response.json();
  },

  async createOrder(userId: number, items: OrderItem[]): Promise<{ id: number }> {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        items
      }),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  },

  async getOrders(): Promise<Order[]> {
    const response = await fetch(`${API_BASE}/orders`);
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  async completeOrder(orderId: number): Promise<{ id: number; status: string }> {
    const response = await fetch(`${API_BASE}/orders/${orderId}/complete`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to complete order');
    return response.json();
  },

  async cancelOrder(orderId: number): Promise<{ id: number; status: string }> {
    const response = await fetch(`${API_BASE}/orders/${orderId}/cancel`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to cancel order');
    return response.json();
  }
};
