class Api::AdminController < ApplicationController
  protect_from_forgery with: :null_session

  def search_google_books
    query = params[:query]
    max_results = params[:max_results] || 20

    if query.blank?
      render json: { error: "Query parameter is required" }, status: 400
      return
    end

    results = GoogleBooksService.search(query, max_results: max_results.to_i)

    if results && results["items"]
      books = results["items"].map do |item|
        GoogleBooksService.extract_book_data(item).merge({
          google_id: item["id"],
          already_imported: Book.exists?(google_books_id: item["id"])
        })
      end

      render json: { books: books, total_items: results["totalItems"] }
    else
      render json: { error: "Failed to fetch books from Google Books API" }, status: 500
    end
  end

  def import_google_book
    google_books_id = params[:google_books_id]
    price = params[:price]&.to_f || 9.99
    stock_qty = params[:stock_qty]&.to_i || 25

    if google_books_id.blank?
      render json: { error: "google_books_id is required" }, status: 400
      return
    end

    # Check if book already exists
    existing_book = Book.find_by(google_books_id: google_books_id)
    if existing_book
      render json: { error: "Book already imported", book: existing_book }, status: 409
      return
    end

    # Fetch book details from Google Books
    google_book_data = GoogleBooksService.get_book_details(google_books_id)

    unless google_book_data
      render json: { error: "Failed to fetch book details from Google Books" }, status: 500
      return
    end

    book_data = GoogleBooksService.extract_book_data(google_book_data)

    # Find or create author
    author = Author.find_or_create_by(name: book_data[:author_name]) if book_data[:author_name]

    # Default to 'Fiction' genre if no categories found
    genre_name = extract_primary_genre(book_data[:categories])
    genre = Genre.find_or_create_by(name: genre_name)

    # Create the book
    book = Book.create!(
      title: book_data[:title],
      author: author,
      genre: genre,
      price: price,
      stock_qty: stock_qty,
      google_books_id: book_data[:google_books_id],
      isbn_10: book_data[:isbn_10],
      isbn_13: book_data[:isbn_13],
      description: book_data[:description],
      cover_image_url: book_data[:cover_image_url],
      published_date: book_data[:published_date],
      page_count: book_data[:page_count],
      categories: book_data[:categories],
      language: book_data[:language],
      isbn: book_data[:isbn_13] || book_data[:isbn_10] || generate_fake_isbn,
      published_at: book_data[:published_date] || Date.current
    )

    render json: {
      message: "Book imported successfully",
      book: {
        id: book.id,
        title: book.title,
        author: book.author.name,
        genre: book.genre.name,
        price: book.price,
        stock_qty: book.stock_qty,
        cover_image_url: book.cover_image_url
      }
    }, status: 201
  end

  def bulk_import_popular_books
    categories = [
      "fiction bestsellers",
      "science fiction",
      "fantasy",
      "mystery thriller",
      "romance",
      "young adult",
      "non-fiction",
      "biography",
      "history",
      "programming"
    ]

    imported_count = 0
    errors = []

    categories.each do |category|
      begin
        results = GoogleBooksService.search(category, max_results: 5)

        if results && results["items"]
          results["items"].each do |item|
            next if Book.exists?(google_books_id: item["id"])

            book_data = GoogleBooksService.extract_book_data(item)
            next if book_data[:title].blank? || book_data[:author_name].blank?

            # Find or create author
            author = Author.find_or_create_by(name: book_data[:author_name])

            # Determine genre from categories
            genre_name = extract_primary_genre(book_data[:categories]) || category.titleize
            genre = Genre.find_or_create_by(name: genre_name)

            # Create book with random pricing
            price = rand(7.99..19.99).round(2)
            stock_qty = rand(15..50)

            Book.create!(
              title: book_data[:title],
              author: author,
              genre: genre,
              price: price,
              stock_qty: stock_qty,
              google_books_id: book_data[:google_books_id],
              isbn_10: book_data[:isbn_10],
              isbn_13: book_data[:isbn_13],
              description: book_data[:description],
              cover_image_url: book_data[:cover_image_url],
              published_date: book_data[:published_date],
              page_count: book_data[:page_count],
              categories: book_data[:categories],
              language: book_data[:language],
              isbn: book_data[:isbn_13] || book_data[:isbn_10] || generate_fake_isbn,
              published_at: book_data[:published_date] || Date.current
            )

            imported_count += 1
            sleep(0.1) # Be nice to the API
          end
        end
      rescue => e
        errors << "Failed to import from category '#{category}': #{e.message}"
      end
    end

    render json: {
      message: "Bulk import completed",
      imported_count: imported_count,
      errors: errors
    }
  end

  def order_analytics
    total_orders = Order.count
    pending_orders = Order.pending.count
    completed_orders = Order.completed.count
    cancelled_orders = Order.cancelled.count

    total_revenue = Order.completed.sum(&:total_price)
    avg_order_value = completed_orders > 0 ? total_revenue / completed_orders : 0

    recent_orders = Order.completed.where("completed_at >= ?", 7.days.ago).count

    top_books = OrderItem.joins(:book, :order)
                         .where(orders: { status: "completed" })
                         .group("books.title", "books.id")
                         .sum(:quantity)
                         .sort_by { |k, v| -v }
                         .first(5)
                         .map { |book_data, quantity|
                           book = Book.find(book_data[1])
                           {
                             title: book_data[0],
                             author: book.author.name,
                             total_sold: quantity
                           }
                         }

    render json: {
      order_stats: {
        total_orders: total_orders,
        pending_orders: pending_orders,
        completed_orders: completed_orders,
        cancelled_orders: cancelled_orders
      },
      revenue_stats: {
        total_revenue: total_revenue.round(2),
        average_order_value: avg_order_value.round(2),
        orders_last_7_days: recent_orders
      },
      top_selling_books: top_books
    }
  end

  private

  def extract_primary_genre(categories_json)
    return "Fiction" if categories_json.blank?

    begin
      categories = JSON.parse(categories_json)
      return "Fiction" if categories.empty?

      # Map Google Books categories to our genres
      category_mappings = {
        "fiction" => "Fiction",
        "science fiction" => "Sci-Fi",
        "fantasy" => "Fantasy",
        "mystery" => "Mystery",
        "thriller" => "Mystery",
        "horror" => "Horror",
        "young adult" => "Young Adult",
        "juvenile" => "Young Adult",
        "romance" => "Romance",
        "biography" => "Biography",
        "history" => "History",
        "business" => "Business",
        "self-help" => "Self-Help",
        "computers" => "Technology",
        "programming" => "Technology"
      }

      # Find the first matching category
      categories.each do |category|
        category_lower = category.downcase
        category_mappings.each do |key, value|
          return value if category_lower.include?(key)
        end
      end

      # Default to the first category, cleaned up
      categories.first.gsub(/[^a-zA-Z\s]/, "").strip.titleize
    rescue JSON::ParserError
      "Fiction"
    end
  end

  def generate_fake_isbn
    # Generate a fake ISBN for books without one
    "GB#{Time.current.to_i}#{rand(1000..9999)}"
  end
end
