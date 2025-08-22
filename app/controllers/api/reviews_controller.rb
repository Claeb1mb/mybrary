class Api::ReviewsController < ApplicationController
  def index
    reviews = Review.where(book_id: params[:book_id]).includes(:user)
    render json: reviews.map { |review|
      {
        rating: review.rating,
        content: review.content,
        created_at: review.created_at,
        reviewer: review.user.full_name
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
    render json: review, status: :created
  end
end
