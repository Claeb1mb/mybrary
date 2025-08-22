module Orders
  class Complete
    def initialize(order:)
      @order = order
    end

    def call
      ActiveRecord::Base.transaction do
        @order.order_items.includes(:book).each do |order_item|
          book = Book.lock.find(order_item.book_id)
          raise StandardError, "insufficient stock for book #{book.title}" if book.stock_qty < order_item.quantity
          book.update!(stock_qty: book.stock_qty - order_item.quantity)
        end
      end
    end
  end
end
