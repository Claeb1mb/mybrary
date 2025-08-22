module Orders
  class Complete
    def initialize(order:)
      @order = order
    end

    def call
      ActiveRecord::Base.transaction do
        # Verify order is in pending status
        raise StandardError, "Order is already #{@order.status}" unless @order.status == 'pending'
        
        # Final stock validation and reduction
        @order.order_items.includes(:book).each do |order_item|
          book = Book.lock.find(order_item.book_id)
          if book.stock_qty < order_item.quantity
            raise StandardError, "insufficient stock for book #{book.title} (#{book.stock_qty} available, #{order_item.quantity} needed)"
          end
          
          # Reduce stock now that order is being completed
          book.update!(stock_qty: book.stock_qty - order_item.quantity)
        end
        
        # Mark order as completed
        @order.update!(status: 'completed', completed_at: Time.current)
        @order
      end
    end
  end
end
