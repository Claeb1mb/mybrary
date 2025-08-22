import React from 'react';
import { useCartStore } from '../store';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose, onCheckout }) => {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const [errors, setErrors] = React.useState<Record<number, string>>({});

  const handleQuantityChange = (bookId: number, newQuantity: number) => {
    const result = updateQuantity(bookId, newQuantity);
    if (!result.success) {
      setErrors(prev => ({ ...prev, [bookId]: result.message || 'Invalid quantity' }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[bookId];
        return newErrors;
      });
    }
  };

  // Clear errors after 3 seconds
  React.useEffect(() => {
    Object.keys(errors).forEach(bookId => {
      const timer = setTimeout(() => {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[parseInt(bookId)];
          return newErrors;
        });
      }, 3000);
      return () => clearTimeout(timer);
    });
  }, [errors]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ width: '500px', maxHeight: '80vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        <div style={{ flex: '1', overflowY: 'auto', padding: '1.5rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Your cart is empty</p>
              <p style={{ fontSize: '0.875rem' }}>Add some books to get started!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map((item) => (
                <div key={item.book.id} className="cart-item" style={{
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb'
                }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: '1' }}>
                      <h4 style={{ fontWeight: '600', marginBottom: '0.25rem', fontSize: '1rem' }}>
                        {item.book.title}
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                        by {item.book.author || item.book.author_name}
                      </p>
                      <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#059669' }}>
                        ${parseFloat(item.book.price).toFixed(2)} each
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>Qty:</label>
                      <input
                        type="number"
                        min="1"
                        max={item.book.stock_qty}
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.book.id, parseInt(e.target.value) || 1)}
                        style={{
                          width: '60px',
                          padding: '0.25rem 0.5rem',
                          border: errors[item.book.id] ? '1px solid #dc2626' : '1px solid #d1d5db',
                          borderRadius: '4px',
                          textAlign: 'center',
                          fontSize: '0.875rem'
                        }}
                      />
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        (max: {item.book.stock_qty})
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontWeight: '600', fontSize: '1rem' }}>
                        Subtotal: ${(parseFloat(item.book.price) * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.book.id)}
                        className="btn btn-danger"
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {errors[item.book.id] && (
                    <div style={{
                      marginTop: '0.5rem',
                      color: '#dc2626',
                      fontSize: '0.75rem',
                      backgroundColor: '#fef2f2',
                      padding: '0.5rem',
                      border: '1px solid #fecaca',
                      borderRadius: '4px'
                    }}>
                      {errors[item.book.id]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div style={{
            borderTop: '1px solid #e5e7eb',
            padding: '1.5rem',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              <span>Total: ${getTotalPrice().toFixed(2)}</span>
              <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '400' }}>
                {items.reduce((sum, item) => sum + item.quantity, 0)} {items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'book' : 'books'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={onCheckout}
                className="btn btn-primary"
                style={{ flex: '2' }}
              >
                📋 Proceed to Checkout
              </button>
              <button
                onClick={clearCart}
                className="btn btn-secondary"
                style={{ flex: '1' }}
              >
                🗑️ Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
