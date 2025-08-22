class Api::ReviewsController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    reviews = Review.where(book_id: params[:book_id]).includes(:user)
    render json: reviews.map { |review|
      {
        id: review.id,
        rating: review.rating,
        content: review.content,
        created_at: review.created_at,
        book_id: review.book_id,
        user_id: review.user_id
      }
    }
  end

  def create
    review = Review.create!(
      user_id: params[:user_id],
      book_id: params[:book_id],
      rating: params[:rating],
      content: params[:content]
    )
    render json: {
      id: review.id,
      rating: review.rating,
      content: review.content,
      created_at: review.created_at,
      book_id: review.book_id,
      user_id: review.user_id
    }, status: :created
  end
end
