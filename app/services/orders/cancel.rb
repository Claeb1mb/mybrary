module Orders
  class Cancel
    def initialize(order:)
      @order = order
    end

    def call
      ActiveRecord::Base.transaction do
        raise StandardError, "Only pending orders can be cancelled" unless @order.status == "pending"

        # Restore stock quantities for all items in the order
        @order.order_items.includes(:book).each do |order_item|
          book = order_item.book
          book.update!(stock_qty: book.stock_qty + order_item.quantity)
        end

        # Update order status to cancelled
        @order.update!(status: "cancelled")

        @order
      end
    end
  end
end
