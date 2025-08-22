import React, { useState } from 'react';
import { Review } from '../types';
import { ReviewForm } from './ReviewForm';

interface ReviewsModalProps {
  reviews: Review[];
  bookTitle: string;
  bookId: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (rating: number, content: string) => void;
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({
  reviews,
  bookTitle,
  bookId,
  isOpen,
  onClose,
  onSubmitReview
}) => {
  const [showForm, setShowForm] = useState(false);

  if (!isOpen) return null;

  const renderStars = (rating: number) => {
    return '★★★★★'.slice(0, rating) + '☆☆☆☆☆'.slice(rating);
  };

  const handleSubmitReview = (rating: number, content: string) => {
    onSubmitReview(rating, content);
    setShowForm(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ width: '600px' }}>
        <div className="modal-header">
          <h2 className="text-lg font-semibold">Reviews for "{bookTitle}"</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        <div className="modal-content">
          {!showForm && (
            <div style={{ marginBottom: '1rem' }}>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Write a Review
              </button>
            </div>
          )}

          {showForm && (
            <ReviewForm
              bookId={bookId}
              onSubmit={handleSubmitReview}
              onCancel={() => setShowForm(false)}
            />
          )}

          {!showForm && (
            <>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>
                All Reviews ({reviews.length})
              </h3>
              {reviews.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center' }}>No reviews yet for this book.</p>
              ) : (
                <div>
                  {reviews.map((review) => (
                    <div key={review.id} className="review">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span className="stars">{renderStars(review.rating)}</span>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ color: '#374151' }}>{review.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
