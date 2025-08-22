import React, { useState } from 'react';

interface ReviewFormProps {
  bookId: number;
  onSubmit: (rating: number, content: string) => void;
  onCancel: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ bookId, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(rating, content.trim());
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoveredStar(star)}
        onMouseLeave={() => setHoveredStar(0)}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
          color: (hoveredStar || rating) >= star ? '#fbbf24' : '#d1d5db',
          padding: '0.25rem'
        }}
      >
        ★
      </button>
    ));
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '1rem' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>
        Write a Review
      </h3>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Rating:
        </label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {renderStars()}
          <span style={{ marginLeft: '0.5rem', color: '#6b7280' }}>
            {rating} star{rating !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Review:
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts about this book..."
          required
          rows={4}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!content.trim()}
          className="btn btn-primary"
        >
          Submit Review
        </button>
      </div>
    </form>
  );
};
