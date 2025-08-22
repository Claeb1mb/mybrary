module Orders
  class Create
    def initialize(user:, items:)
      @user, @items = user, items
    end

    def call
      ActiveRecord::Base.transaction do
        order = @user.orders.create!
        Book.lock.where(id: @items.map { _1[:book_id] }).index_by(&:id).tap do |books|
          @items.each do |item|
            book = books[item[:book_id].to_i] or raise ActiveRecord::RecordNotFound
            qty = item[:quantity].to_i
            raise StandardError, "insufficient stock for book #{book.title}" if book.stock_qty < qty
            book.update!(stock_qty: book.stock_qty - qty)
            order.order_items.create!(book: book, quantity: qty, unit_price: book.price)
          end
        end
        order
      end
    end
  end
end
