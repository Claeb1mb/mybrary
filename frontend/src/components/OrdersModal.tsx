import React from 'react';
import { Order } from '../types';

interface OrdersModalProps {
  orders: Order[];
  isOpen: boolean;
  onClose: () => void;
  onCompleteOrder: (orderId: number) => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({ orders, isOpen, onClose, onCompleteOrder }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-96 overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Order History</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-64">
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center">No orders found.</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Order #{order.id}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(order.order_date).toLocaleDateString()}
                      </p>
                      <p className="text-lg font-semibold text-green-600">
                        ${order.total_amount}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>

                      {order.status === 'pending' && (
                        <button
                          onClick={() => onCompleteOrder(order.id)}
                          className="block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Complete Order
                        </button>
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
