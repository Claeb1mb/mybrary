class AddGoogleBooksFieldsToBooks < ActiveRecord::Migration[7.2]
  def change
    add_column :books, :google_books_id, :string
    add_column :books, :isbn_10, :string
    add_column :books, :isbn_13, :string
    add_column :books, :cover_image_url, :string
    add_column :books, :published_date, :date
    add_column :books, :page_count, :integer
    add_column :books, :categories, :text
    add_column :books, :language, :string
  end
end
