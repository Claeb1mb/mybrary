class Api::BooksController < ApplicationController
  def index
    books = Book.includes(:author, :genre)
    books = books.joins(:author).where("authors.name ILIKE ?", "%#{params[:author]}%") if params[:author].present?
    render json: books.map { |book|
      {
        id: book.id,
        title: book.title,
        author: book.author.name,
        genre: book.genre.name,
        price: book.price,
        stock_qty: book.stock_qty
      }
    }
  end

  def show
    book = Book.find(params[:id])
    render json: {
      id: book.id,
      title: book.title,
      description: book.description,
      price: book.price,
      author: book.author.name,
      genre: book.genre.name,
      stock_qty: book.stock_qty
    }
  end

  def reviews
    book = Book.find(params[:book_id])
    reviews = book.reviews.includes(:user).order(created_at: :desc)
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
end
