class Init < ActiveRecord::Migration[7.2]
  def change
    enable_extension 'citext' unless extension_enabled?('citext')

    create_table :users do |t|
      t.string :full_name, null: false
      t.citext :email, null: false
      t.string :password_digest, null: false
      t.timestamps
    end
    add_index :users, :email, unique: true

    create_table :authors do |t|
      t.string :name, null: false
      t.timestamps
    end
    add_index :authors, :name, unique: true

    create_table :genres do |t|
      t.string :name, null: false
      t.timestamps
    end
    add_index :genres, :name, unique: true

    create_table :books do |t|
      t.string :title, null: false
      t.references :author, null: false, foreign_key: { on_delete: :restrict }
      t.references :genre,  null: false, foreign_key: { on_delete: :restrict }
      t.decimal :price, precision: 10, scale: 2, null: false, default: 0
      t.integer :stock_qty, null: false, default: 0
      t.string  :isbn
      t.text    :description
      t.string  :image_url
      t.date    :published_at
      t.timestamps
    end
    add_index :books, :isbn, unique: true
    add_check_constraint :books, 'price >= 0', name: 'books_price_positive'
    add_check_constraint :books, 'stock_qty >= 0', name: 'books_stock_nonneg'

    create_table :reviews do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.references :book, null: false, foreign_key: { on_delete: :cascade }
      t.integer :rating, null: false
      t.text    :content
      t.timestamps
    end
    add_index :reviews, [ :user_id, :book_id ], unique: true
    add_index :reviews, [ :book_id, :created_at ]
    add_check_constraint :reviews, 'rating BETWEEN 1 AND 5', name: 'reviews_rating_1_5'

    create_table :orders do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.datetime :order_date, null: false, default: -> { 'CURRENT_TIMESTAMP' }
      t.string   :status, null: false, default: 'pending'
      t.timestamps
    end
    add_index :orders, [ :user_id, :order_date ]
    add_check_constraint :orders, "status IN ('pending','completed','cancelled')", name: 'orders_status_chk'

    create_table :order_items do |t|
      t.references :order, null: false, foreign_key: { on_delete: :cascade }
      t.references :book,  null: false, foreign_key: { on_delete: :restrict }
      t.integer :quantity, null: false
      t.decimal :unit_price, precision: 10, scale: 2, null: false
      t.timestamps
    end
    add_index :order_items, [ :order_id, :book_id ], unique: true
    add_check_constraint :order_items, 'quantity > 0', name: 'order_items_qty_positive'
    add_check_constraint :order_items, 'unit_price >= 0', name: 'order_items_unit_price_positive'
  end
end
