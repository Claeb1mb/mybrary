# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
u1 = User.find_by(email: 'avant@example.com')
if u1.nil?
  u1 = User.create!(
    email: 'avant@example.com',
    full_name: 'Avant Johnson',
    password: 'test123456'
  )
end

u2 = User.find_by(email: 'benjamin@example.com')
if u2.nil?
  u2 = User.create!(
    email: 'benjamin@example.com',
    full_name: 'Benjamin Carter',
    password: 'test123456'
  )
end

a1 = Author.find_or_create_by!(name: 'Octavia E. Butler')
a2 = Author.find_or_create_by!(name: 'Brandon Sanderson')
a3 = Author.find_or_create_by!(name: 'Toni Morrison')

g1 = Genre.find_or_create_by!(name: 'Sci-Fi'); g2 = Genre.find_or_create_by!(name: 'Fantasy'); g3 = Genre.find_or_create_by!(name: 'Literary')

b1 = Book.find_or_create_by!(isbn: '9780807083697') do |book|
  book.title = 'Kindred'
  book.author = a1
  book.genre = g1
  book.price = 14.99
  book.stock_qty = 20
  book.published_at = '1979-06-01'
end
b2 = Book.find_or_create_by!(isbn: '9780765311788') do |book|
  book.title = 'Mistborn'
  book.author = a2
  book.genre = g2
  book.price = 9.99
  book.stock_qty = 35
  book.published_at = '2006-07-17'
end
b3 = Book.find_or_create_by!(isbn: '9781400033416') do |book|
  book.title = 'Beloved'
  book.author = a3
  book.genre = g3
  book.price = 12.50
  book.stock_qty = 15
  book.published_at = '1987-09-02'
end

Review.find_or_create_by!(user: u1, book: b1) do |review|
  review.rating = 5
  review.content = 'Masterpiece.'
end
Review.find_or_create_by!(user: u2, book: b2) do |review|
  review.rating = 4
  review.content = 'Great magic system.'
end
