require 'net/http'
require 'json'

class GoogleBooksService
  BASE_URL = 'https://www.googleapis.com/books/v1/volumes'

  def self.search(query, start_index: 0, max_results: 20)
    uri = URI("#{BASE_URL}?q=#{URI.encode_www_form_component(query)}&startIndex=#{start_index}&maxResults=#{max_results}")
    
    begin
      response = Net::HTTP.get_response(uri)
      if response.code == '200'
        JSON.parse(response.body)
      else
        Rails.logger.error "Google Books API error: #{response.code} - #{response.body}"
        nil
      end
    rescue => e
      Rails.logger.error "Google Books API request failed: #{e.message}"
      nil
    end
  end

  def self.get_book_details(google_books_id)
    uri = URI("#{BASE_URL}/#{google_books_id}")
    
    begin
      response = Net::HTTP.get_response(uri)
      if response.code == '200'
        JSON.parse(response.body)
      else
        Rails.logger.error "Google Books API error: #{response.code} - #{response.body}"
        nil
      end
    rescue => e
      Rails.logger.error "Google Books API request failed: #{e.message}"
      nil
    end
  end

  def self.search_by_title_and_author(title, author)
    query = "intitle:#{title}"
    query += " inauthor:#{author}" if author.present?
    search(query, max_results: 5)
  end

  def self.extract_book_data(google_book_item)
    volume_info = google_book_item['volumeInfo'] || {}
    industry_identifiers = volume_info['industryIdentifiers'] || []
    
    isbn_10 = industry_identifiers.find { |id| id['type'] == 'ISBN_10' }&.dig('identifier')
    isbn_13 = industry_identifiers.find { |id| id['type'] == 'ISBN_13' }&.dig('identifier')
    
    cover_image_url = volume_info.dig('imageLinks', 'thumbnail') || 
                     volume_info.dig('imageLinks', 'smallThumbnail')
    
    {
      google_books_id: google_book_item['id'],
      title: volume_info['title'],
      author_name: volume_info['authors']&.join(', '),
      description: volume_info['description'],
      isbn_10: isbn_10,
      isbn_13: isbn_13,
      cover_image_url: cover_image_url,
      published_date: parse_published_date(volume_info['publishedDate']),
      page_count: volume_info['pageCount'],
      categories: volume_info['categories']&.to_json,
      language: volume_info['language']
    }
  end

  private

  def self.parse_published_date(date_string)
    return nil if date_string.blank?
    
    # Handle different date formats from Google Books
    case date_string.length
    when 4 # Year only (e.g., "2020")
      Date.new(date_string.to_i, 1, 1)
    when 7 # Year-Month (e.g., "2020-03")
      Date.parse("#{date_string}-01")
    else # Full date (e.g., "2020-03-15")
      Date.parse(date_string)
    end
  rescue Date::Error
    nil
  end
end
