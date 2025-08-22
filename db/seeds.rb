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
a4 = Author.find_or_create_by!(name: 'Isaac Asimov')
a5 = Author.find_or_create_by!(name: 'Margaret Atwood')
a6 = Author.find_or_create_by!(name: 'J.K. Rowling')
a7 = Author.find_or_create_by!(name: 'George R.R. Martin')
a8 = Author.find_or_create_by!(name: 'Ursula K. Le Guin')
a9 = Author.find_or_create_by!(name: 'Stephen King')
a10 = Author.find_or_create_by!(name: 'Agatha Christie')
a11 = Author.find_or_create_by!(name: 'J.R.R. Tolkien')
a12 = Author.find_or_create_by!(name: 'Frank Herbert')

g1 = Genre.find_or_create_by!(name: 'Sci-Fi')
g2 = Genre.find_or_create_by!(name: 'Fantasy')
g3 = Genre.find_or_create_by!(name: 'Literary')
g4 = Genre.find_or_create_by!(name: 'Mystery')
g5 = Genre.find_or_create_by!(name: 'Horror')
g6 = Genre.find_or_create_by!(name: 'Young Adult')

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

b4 = Book.find_or_create_by!(isbn: '9780553293357') do |book|
  book.title = 'Foundation'
  book.author = a4
  book.genre = g1
  book.price = 8.99
  book.stock_qty = 25
  book.published_at = '1951-05-01'
end

b5 = Book.find_or_create_by!(isbn: '9780385490818') do |book|
  book.title = 'The Handmaid\'s Tale'
  book.author = a5
  book.genre = g1
  book.price = 11.99
  book.stock_qty = 30
  book.published_at = '1985-08-01'
end

b6 = Book.find_or_create_by!(isbn: '9780439708180') do |book|
  book.title = 'Harry Potter and the Sorcerer\'s Stone'
  book.author = a6
  book.genre = g6
  book.price = 7.99
  book.stock_qty = 50
  book.published_at = '1997-06-26'
end

b7 = Book.find_or_create_by!(isbn: '9780553108354') do |book|
  book.title = 'A Game of Thrones'
  book.author = a7
  book.genre = g2
  book.price = 13.99
  book.stock_qty = 40
  book.published_at = '1996-08-01'
end

b8 = Book.find_or_create_by!(isbn: '9780441478125') do |book|
  book.title = 'The Left Hand of Darkness'
  book.author = a8
  book.genre = g1
  book.price = 10.99
  book.stock_qty = 18
  book.published_at = '1969-08-01'
end

b9 = Book.find_or_create_by!(isbn: '9780307743657') do |book|
  book.title = 'The Stand'
  book.author = a9
  book.genre = g5
  book.price = 16.99
  book.stock_qty = 22
  book.published_at = '1978-10-03'
end

b10 = Book.find_or_create_by!(isbn: '9780062073488') do |book|
  book.title = 'And Then There Were None'
  book.author = a10
  book.genre = g4
  book.price = 9.49
  book.stock_qty = 28
  book.published_at = '1939-11-06'
end

b11 = Book.find_or_create_by!(isbn: '9780547928227') do |book|
  book.title = 'The Hobbit'
  book.author = a11
  book.genre = g2
  book.price = 8.99
  book.stock_qty = 45
  book.published_at = '1937-09-21'
end

b12 = Book.find_or_create_by!(isbn: '9780441172719') do |book|
  book.title = 'Dune'
  book.author = a12
  book.genre = g1
  book.price = 12.99
  book.stock_qty = 32
  book.published_at = '1965-08-01'
end

b13 = Book.find_or_create_by!(isbn: '9780765326355') do |book|
  book.title = 'The Way of Kings'
  book.author = a2
  book.genre = g2
  book.price = 15.99
  book.stock_qty = 27
  book.published_at = '2010-08-31'
end

b14 = Book.find_or_create_by!(isbn: '9780439139595') do |book|
  book.title = 'Harry Potter and the Goblet of Fire'
  book.author = a6
  book.genre = g6
  book.price = 8.99
  book.stock_qty = 33
  book.published_at = '2000-07-08'
end

b15 = Book.find_or_create_by!(isbn: '9780307277671') do |book|
  book.title = 'The Shining'
  book.author = a9
  book.genre = g5
  book.price = 11.99
  book.stock_qty = 19
  book.published_at = '1977-01-28'
end

Review.find_or_create_by!(user: u1, book: b1) do |review|
  review.rating = 5
  review.content = 'Absolutely brilliant time-travel narrative. Butler masterfully explores the brutal realities of slavery through a modern lens.'
end

Review.find_or_create_by!(user: u2, book: b2) do |review|
  review.rating = 4
  review.content = 'Great magic system and world-building. Sanderson really knows how to craft epic fantasy.'
end

Review.find_or_create_by!(user: u1, book: b4) do |review|
  review.rating = 5
  review.content = 'A cornerstone of science fiction. Asimov\'s psychohistory concept is fascinating and prescient.'
end

Review.find_or_create_by!(user: u2, book: b5) do |review|
  review.rating = 4
  review.content = 'Chilling and relevant. Atwood\'s dystopian vision feels more urgent than ever.'
end

Review.find_or_create_by!(user: u1, book: b6) do |review|
  review.rating = 5
  review.content = 'The book that started it all! Rowling created a magical world that captured millions of hearts.'
end

Review.find_or_create_by!(user: u2, book: b7) do |review|
  review.rating = 4
  review.content = 'Complex political intrigue and memorable characters. Martin doesn\'t hold back.'
end

Review.find_or_create_by!(user: u1, book: b8) do |review|
  review.rating = 5
  review.content = 'Le Guin\'s exploration of gender and society is groundbreaking. A true sci-fi masterpiece.'
end

Review.find_or_create_by!(user: u2, book: b10) do |review|
  review.rating = 4
  review.content = 'Christie at her finest. The plot twists keep you guessing until the very end.'
end

Review.find_or_create_by!(user: u1, book: b11) do |review|
  review.rating = 5
  review.content = 'A delightful adventure that started the fantasy genre as we know it. Timeless storytelling.'
end

Review.find_or_create_by!(user: u2, book: b12) do |review|
  review.rating = 5
  review.content = 'Epic space opera with incredible world-building. Herbert created something truly special.'
end
