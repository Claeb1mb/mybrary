import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';
import { Book } from './types';
import { useCartStore } from './store';
import { Header } from './components/Header';
import { BookCard } from './components/BookCard';
import { SearchAndFilter } from './components/SearchAndFilter';
import { CartModal } from './components/CartModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ReviewsModal } from './components/ReviewsModal';
import { OrdersModal } from './components/OrdersModal';

const queryClient = new QueryClient();

function BookStore() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const { items, clearCart } = useCartStore();
  const queryClientInstance = useQueryClient();

  const { data: books = [], isLoading: booksLoading } = useQuery({
    queryKey: ['books', searchTerm, selectedGenre],
    queryFn: () => api.getBooks({
      search: searchTerm || undefined,
      genre: selectedGenre || undefined
    })
  });

  const { data: genres = [] } = useQuery({
    queryKey: ['genres'],
    queryFn: api.getGenres
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', selectedBook?.id],
    queryFn: () => selectedBook ? api.getReviews(selectedBook.id) : Promise.resolve([]),
    enabled: !!selectedBook
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: api.getOrders
  });

  const createOrderMutation = useMutation({
    mutationFn: (orderData: { userId: number; items: { book_id: number; quantity: number }[] }) =>
      api.createOrder(orderData.userId, orderData.items),
    onSuccess: () => {
      clearCart();
      setIsCheckoutOpen(false);
      queryClientInstance.invalidateQueries({ queryKey: ['orders'] });
      alert('Order placed successfully!');
    },
    onError: (error) => {
      console.error('Order failed:', error);
      alert('Failed to place order. Please try again.');
    }
  });

  const completeOrderMutation = useMutation({
    mutationFn: api.completeOrder,
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: ['orders'] });
      alert('Order completed successfully!');
    },
    onError: (error) => {
      console.error('Failed to complete order:', error);
      alert('Failed to complete order. Please try again.');
    }
  });

  const cancelOrderMutation = useMutation({
    mutationFn: api.cancelOrder,
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: ['orders'] });
      queryClientInstance.invalidateQueries({ queryKey: ['books'] });
      alert('Order cancelled successfully! Stock quantities have been restored.');
    },
    onError: (error) => {
      console.error('Failed to cancel order:', error);
      alert('Failed to cancel order. Please try again.');
    }
  });

  const createReviewMutation = useMutation({
    mutationFn: ({ bookId, rating, content }: { bookId: number; rating: number; content: string }) =>
      api.createReview(bookId, 1, rating, content), // Using hardcoded user ID as per MVP requirements
    onSuccess: () => {
      queryClientInstance.invalidateQueries({ queryKey: ['reviews', selectedBook?.id] });
      alert('Review submitted successfully!');
    },
    onError: (error) => {
      console.error('Failed to create review:', error);
      alert('Failed to submit review. Please try again.');
    }
  });

  const handleViewReviews = (book: Book) => {
    setSelectedBook(book);
    setIsReviewsOpen(true);
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleConfirmOrder = () => {
    const orderItems = items.map(item => ({
      book_id: item.book.id,
      quantity: item.quantity
    }));

    createOrderMutation.mutate({
      userId: 1, // Using hardcoded user ID as per MVP requirements
      items: orderItems
    });
  };

  const handleCompleteOrder = (orderId: number) => {
    completeOrderMutation.mutate(orderId);
  };

  const handleCancelOrder = (orderId: number) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrderMutation.mutate(orderId);
    }
  };

  const handleCreateReview = (rating: number, content: string) => {
    if (!selectedBook) return;
    createReviewMutation.mutate({
      bookId: selectedBook.id,
      rating,
      content
    });
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  const handleGenreFilter = (genre: string) => {
    setSelectedGenre(genre);
  };

  if (booksLoading) {
    return (
      <div className="empty-state" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.25rem' }}>Loading books...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header
        onCartClick={() => setIsCartOpen(true)}
        onOrdersClick={() => setIsOrdersOpen(true)}
      />

      <main className="main">
        <div className="container">
          <div className="mb-4">
            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Browse Books</h2>
            <p style={{ color: '#6b7280' }}>Discover your next great read</p>
          </div>

          <SearchAndFilter
            onSearch={handleSearch}
            onGenreFilter={handleGenreFilter}
            genres={genres}
            currentSearch={searchTerm}
            currentGenre={selectedGenre}
          />

          <div className="books-grid">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onViewReviews={handleViewReviews}
              />
            ))}
          </div>

          {books.length === 0 && !booksLoading && (
            <div className="empty-state">
              <p>
                {searchTerm || selectedGenre
                  ? 'No books found matching your search criteria.'
                  : 'No books available at the moment.'
                }
              </p>
              {(searchTerm || selectedGenre) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedGenre('');
                  }}
                  className="btn btn-secondary"
                  style={{ marginTop: '1rem' }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onConfirm={handleConfirmOrder}
        isLoading={createOrderMutation.isPending}
      />

      <ReviewsModal
        reviews={reviews}
        bookTitle={selectedBook?.title || ''}
        bookId={selectedBook?.id || 0}
        isOpen={isReviewsOpen}
        onClose={() => {
          setIsReviewsOpen(false);
          setSelectedBook(null);
        }}
        onSubmitReview={handleCreateReview}
      />

      <OrdersModal
        orders={orders}
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        onCompleteOrder={handleCompleteOrder}
        onCancelOrder={handleCancelOrder}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BookStore />
    </QueryClientProvider>
  );
}

export default App;
