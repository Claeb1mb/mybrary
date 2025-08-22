import React from 'react';
import { Order } from '../types';

interface OrdersModalProps {
  orders: Order[];
  isOpen: boolean;
  onClose: () => void;
  onCompleteOrder: (orderId: number) => void;
  onCancelOrder: (orderId: number) => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({ orders, isOpen, onClose, onCompleteOrder, onCancelOrder }) => {
  if (!isOpen) return null;

  const visibleOrders = orders.filter(order => order.status !== 'cancelled');

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ width: '700px', maxHeight: '80vh' }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Order History</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        <div style={{ padding: '1.5rem', overflowY: 'auto', maxHeight: '60vh' }}>
          {visibleOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No orders found</p>
              <p style={{ fontSize: '0.875rem' }}>Your order history will appear here after you make a purchase.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {visibleOrders.map((order) => (
                <div key={order.id} style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  backgroundColor: '#f9fafb'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                        Order #{order.id}
                      </h4>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                        Placed on {new Date(order.order_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {order.completed_at && (
                        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                          Completed on {new Date(order.completed_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}

                      {order.books && order.books.length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                          <p style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                            Items ({order.item_count} {order.item_count === 1 ? 'book' : 'books'}):
                          </p>
                          <div style={{ marginLeft: '1rem' }}>
                            {order.books.map((book, index) => (
                              <div key={index} style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                                • {book.title} by {book.author} (Qty: {book.quantity}) - ${book.unit_price}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#059669', marginTop: '1rem' }}>
                        Total: ${parseFloat(order.total_amount).toFixed(2)}
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                      <span
                        className={getStatusStyle(order.status)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '9999px',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        {formatStatus(order.status)}
                      </span>

                      {order.status === 'pending' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <button
                            onClick={() => onCompleteOrder(order.id)}
                            className="btn btn-primary"
                            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
                          >
                            Complete Order
                          </button>
                          <button
                            onClick={() => onCancelOrder(order.id)}
                            className="btn btn-secondary"
                            style={{
                              fontSize: '0.875rem',
                              padding: '0.5rem 1rem',
                              backgroundColor: '#dc2626',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Cancel Order
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
