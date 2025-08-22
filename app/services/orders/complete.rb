module Orders
  class Complete
    def initialize(order:)
      @order = order
    end

    def call
      ActiveRecord::Base.transaction do
        raise StandardError, "Order is already #{@order.status}" unless @order.status == "pending"

        @order.order_items.includes(:book).each do |order_item|
          book = Book.lock.find(order_item.book_id)
          if book.stock_qty < order_item.quantity
            raise StandardError, "insufficient stock for book #{book.title} (#{book.stock_qty} available, #{order_item.quantity} needed)"
          end

          book.update!(stock_qty: book.stock_qty - order_item.quantity)
        end

        @order.update!(status: "completed", completed_at: Time.current)
        @order
      end
    end
  end
end
