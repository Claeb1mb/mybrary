module Orders
  class Create
    def initialize(user:, items:)
      @user, @items = user, items
    end

    def call
      ActiveRecord::Base.transaction do
        # Create order in 'pending' status (don't reduce stock yet)
        order = @user.orders.create!(status: 'pending', order_date: Time.current)
        
        # Validate stock availability and create order items
        Book.lock.where(id: @items.map { _1[:book_id] }).index_by(&:id).tap do |books|
          @items.each do |item|
            book = books[item[:book_id].to_i] or raise ActiveRecord::RecordNotFound
            qty = item[:quantity].to_i
            
            # Check stock but don't reduce it yet (order is still pending)
            raise StandardError, "insufficient stock for book #{book.title}" if book.stock_qty < qty
            
            # Create order item with current book price
            order.order_items.create!(book: book, quantity: qty, unit_price: book.price)
          end
        end
        
        order
      end
    end
  end
end
