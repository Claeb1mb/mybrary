import React from 'react';
import { useCartStore } from '../store';

interface HeaderProps {
  onCartClick: () => void;
  onOrdersClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCartClick, onOrdersClick }) => {
  const getTotalItems = useCartStore(state => state.getTotalItems);
  const totalItems = getTotalItems();

  return (
    <header className="header">
      <div className="header-content container">
        <h1>Mybrary</h1>

        <div className="header-buttons">
          <button
            onClick={onOrdersClick}
            className="btn btn-primary"
          >
            Orders
          </button>
          <button
            onClick={onCartClick}
            className="btn btn-primary relative"
          >
            Cart
            {totalItems > 0 && (
              <span className="cart-badge">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
