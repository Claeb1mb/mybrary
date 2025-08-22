export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  price: string;
  stock_qty: number;
  author_name?: string;
  cover_image_url?: string;
  description?: string;
  published_date?: string;
  page_count?: number;
  isbn_10?: string;
  isbn_13?: string;
  categories?: string;
  language?: string;
}

export interface Review {
  id: number;
  rating: number;
  content: string;
  created_at: string;
  book_id: number;
  user_id: number;
}

export interface Genre {
  id: number;
  name: string;
  book_count: number;
}

export interface Order {
  id: number;
  order_date: string;
  total_amount: string;
  status: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface OrderItem {
  book_id: number;
  quantity: number;
}
