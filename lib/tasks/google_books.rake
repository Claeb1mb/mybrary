namespace :google_books do
  desc "Enhance existing books with Google Books data"
  task enhance_books: :environment do
    puts "Enhancing existing books with Google Books data..."

    Book.includes(:author).where(google_books_id: nil).find_each do |book|
      puts "Processing: #{book.title} by #{book.author.name}"

      # Search for the book on Google Books
      results = GoogleBooksService.search_by_title_and_author(book.title, book.author.name)

      if results && results["items"]&.any?
        # Take the first result (most relevant)
        google_book_data = GoogleBooksService.extract_book_data(results["items"].first)

        # Update the book with Google Books data
        book.update!(
          google_books_id: google_book_data[:google_books_id],
          isbn_10: google_book_data[:isbn_10],
          isbn_13: google_book_data[:isbn_13],
          cover_image_url: google_book_data[:cover_image_url],
          published_date: google_book_data[:published_date],
          page_count: google_book_data[:page_count],
          categories: google_book_data[:categories],
          language: google_book_data[:language]
        )

        # Only update description if it's currently blank
        if book.description.blank? && google_book_data[:description].present?
          book.update!(description: google_book_data[:description])
        end

        puts "  ✓ Enhanced with cover image and metadata"
      else
        puts "  ✗ No Google Books data found"
      end

      # Be nice to the API - small delay between requests
      sleep(0.1)
    end

    puts "Book enhancement complete!"
  end

  desc "Search Google Books API"
  task :search, [ :query ] => :environment do |t, args|
    query = args[:query] || "Ruby programming"
    puts "Searching Google Books for: #{query}"

    results = GoogleBooksService.search(query, max_results: 5)

    if results && results["items"]
      results["items"].each_with_index do |item, index|
        volume_info = item["volumeInfo"]
        puts "\n#{index + 1}. #{volume_info['title']}"
        puts "   Authors: #{volume_info['authors']&.join(', ')}"
        puts "   Published: #{volume_info['publishedDate']}"
        puts "   Pages: #{volume_info['pageCount']}"
        puts "   Categories: #{volume_info['categories']&.join(', ')}"
        puts "   Google Books ID: #{item['id']}"
      end
    else
      puts "No results found or API error"
    end
  end
end
