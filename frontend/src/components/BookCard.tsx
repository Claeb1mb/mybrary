import React from 'react';
import { Book } from '../types';
import { useCartStore } from '../store';

interface BookCardProps {
  book: Book;
  onViewReviews: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onViewReviews }) => {
  const [quantity, setQuantity] = React.useState(1);
  const addItem = useCartStore(state => state.addItem);

  const handleAddToCart = () => {
    if (book.stock_qty > 0) {
      addItem(book, quantity);
      setQuantity(1);
    }
  };

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
        </div>

        <div className="quantity-control">
          <label className="text-sm font-semibold">Qty:</label>
          <input
            type="number"
            min="1"
            max={book.stock_qty}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="quantity-input"
          />
        </div>

        <div className="book-actions">
          <button
            onClick={handleAddToCart}
            disabled={book.stock_qty === 0}
            className={`btn ${book.stock_qty === 0 ? '' : 'btn-primary'}`}
          >
            {book.stock_qty === 0 ? 'Out of Stock' : 'Add to Cart'}
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
