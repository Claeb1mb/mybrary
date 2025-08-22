export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  price: string;
  stock_qty: number;
  author_name?: string;
}

export interface Review {
  id: number;
  rating: number;
  content: string;
  created_at: string;
  book_id: number;
  user_id: number;
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
