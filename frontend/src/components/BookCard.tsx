import React from 'react';
import { Book } from '../types';
import { useCartStore } from '../store';

interface BookCardProps {
  book: Book;
  onViewReviews: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onViewReviews }) => {
  const [quantity, setQuantity] = React.useState(1);
  const [error, setError] = React.useState<string>('');
  const addItem = useCartStore(state => state.addItem);
  const items = useCartStore(state => state.items);

  // Calculate how many are already in cart
  const itemInCart = items.find(item => item.book.id === book.id);
  const quantityInCart = itemInCart ? itemInCart.quantity : 0;
  const availableToAdd = Math.max(0, book.stock_qty - quantityInCart);

  const handleAddToCart = () => {
    if (book.stock_qty > 0) {
      const result = addItem(book, quantity);
      if (result.success) {
        setQuantity(1);
        setError('');
      } else {
        setError(result.message || 'Unable to add to cart');
      }
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
    setError(''); // Clear error when quantity changes
  };

  React.useEffect(() => {
    // Clear error after a few seconds
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="book-card">
      <div className="book-image-container">
        {book.cover_image_url ? (
          <img
            src={book.cover_image_url}
            alt={`Cover of ${book.title}`}
            className="book-cover-image"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="book-cover-placeholder">
            <span>📚</span>
            <p>No Cover</p>
          </div>
        )}
      </div>

      <div className="book-content">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author || book.author_name}</p>
        <p className="book-genre">{book.genre}</p>

        {book.published_date && (
          <p className="book-published">Published: {new Date(book.published_date).getFullYear()}</p>
        )}

        {book.page_count && (
          <p className="book-pages">{book.page_count} pages</p>
        )}

        <p className="book-price">${book.price}</p>

        <div className="book-stock">
          Stock: {book.stock_qty} {book.stock_qty === 1 ? 'copy' : 'copies'}
          {quantityInCart > 0 && (
            <span style={{ color: '#6b7280', fontSize: '0.875rem', marginLeft: '0.5rem' }}>
              ({quantityInCart} in cart, {availableToAdd} more available)
            </span>
          )}
        </div>

        {error && (
          <div style={{
            color: '#dc2626',
            fontSize: '0.875rem',
            padding: '0.5rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '4px',
            marginBottom: '0.5rem'
          }}>
            {error}
          </div>
        )}

        <div className="quantity-control">
          <label className="text-sm font-semibold">Qty:</label>
          <input
            type="number"
            min="1"
            max={availableToAdd > 0 ? Math.min(quantity + availableToAdd, book.stock_qty) : 1}
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            className="quantity-input"
          />
          {availableToAdd < book.stock_qty && (
            <span style={{ fontSize: '0.75rem', color: '#6b7280', marginLeft: '0.5rem' }}>
              (max: {Math.min(quantity + availableToAdd, book.stock_qty)})
            </span>
          )}
        </div>

        <div className="book-actions">
          <button
            onClick={handleAddToCart}
            disabled={book.stock_qty === 0 || availableToAdd === 0}
            className={`btn ${(book.stock_qty === 0 || availableToAdd === 0) ? '' : 'btn-primary'}`}
          >
            {book.stock_qty === 0
              ? 'Out of Stock'
              : availableToAdd === 0
                ? 'Max in Cart'
                : 'Add to Cart'
            }
          </button>
          <button
            onClick={() => onViewReviews(book)}
            className="btn btn-secondary"
          >
            Reviews
          </button>
        </div>
      </div>
    </div>
  );
};
