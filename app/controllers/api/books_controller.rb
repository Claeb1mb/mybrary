class Api::BooksController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    books = Book.includes(:author, :genre)
    
    # Filter by genre if specified
    if params[:genre].present?
      books = books.joins(:genre).where("genres.name ILIKE ?", "%#{params[:genre]}%")
    end
    
    # Filter by author if specified
    if params[:author].present?
      books = books.joins(:author).where("authors.name ILIKE ?", "%#{params[:author]}%")
    end
    
    # Search by title, author, or description
    if params[:search].present?
      search_term = "%#{params[:search]}%"
      books = books.joins(:author).where(
        "books.title ILIKE ? OR authors.name ILIKE ? OR books.description ILIKE ?",
        search_term, search_term, search_term
      )
    end
    
    render json: books.map { |book|
      {
        id: book.id,
        title: book.title,
        author: book.author.name,
        genre: book.genre.name,
        price: book.price,
        stock_qty: book.stock_qty,
        cover_image_url: book.cover_image_url,
        description: book.description,
        published_date: book.published_date,
        page_count: book.page_count,
        isbn_10: book.isbn_10,
        isbn_13: book.isbn_13
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
      stock_qty: book.stock_qty,
      cover_image_url: book.cover_image_url,
      published_date: book.published_date,
      page_count: book.page_count,
      isbn_10: book.isbn_10,
      isbn_13: book.isbn_13,
      categories: book.categories,
      language: book.language
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

  def genres
    genres = Genre.all.order(:name)
    render json: genres.map { |genre|
      {
        id: genre.id,
        name: genre.name,
        book_count: genre.books.count
      }
    }
  end
end
