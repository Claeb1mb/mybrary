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
        total_amount: order.total_price,
        status: order.status
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
    Orders::Complete.new(order: order).call
    render json: { id: order.id, status: "completed" }, status: :ok
  end
end
