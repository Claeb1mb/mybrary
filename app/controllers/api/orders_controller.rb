class Api::OrdersController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    orders = if params[:user_id]
               Order.where(user_id: params[:user_id]).order(order_date: :desc)
    else
               Order.all.order(order_date: :desc)
    end

    render json: orders.map { |order|
      {
        id: order.id,
        order_date: order.order_date,
        completed_at: order.completed_at,
        total_amount: order.total_price,
        status: order.status,
        item_count: order.order_items.sum(:quantity),
        books: order.order_items.includes(:book).map { |item|
          {
            title: item.book.title,
            author: item.book.author.name,
            quantity: item.quantity,
            unit_price: item.unit_price
          }
        }
      }
    }
  end

  def create
    user = User.find(params[:user_id])
    items = params.require(:items).map do |item|
      {
        book_id: item[:book_id],
        quantity: item[:quantity].to_i
      }
    end

    begin
      order = Orders::Create.new(user: user, items: items).call
      render json: {
        id: order.id
      }, status: :created
    rescue StandardError => e
      if e.message.include?("insufficient stock")
        render json: {
          error: "Stock validation failed",
          message: e.message
        }, status: :unprocessable_entity
      else
        render json: {
          error: "Order creation failed",
          message: e.message
        }, status: :internal_server_error
      end
    end
  end

  def complete
    order = Order.find(params[:id])

    begin
      completed_order = Orders::Complete.new(order: order).call
      render json: {
        id: completed_order.id,
        status: completed_order.status,
        completed_at: completed_order.completed_at,
        message: "Order completed successfully"
      }, status: :ok
    rescue StandardError => e
      render json: {
        error: "Order completion failed",
        message: e.message
      }, status: :unprocessable_entity
    end
  end

  def cancel
    order = Order.find(params[:id])

    begin
      cancelled_order = Orders::Cancel.new(order: order).call
      render json: {
        id: cancelled_order.id,
        status: cancelled_order.status,
        message: "Order cancelled successfully"
      }, status: :ok
    rescue StandardError => e
      render json: {
        error: "Order cancellation failed",
        message: e.message
      }, status: :unprocessable_entity
    end
  end
end
