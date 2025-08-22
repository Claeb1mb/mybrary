class Book < ApplicationRecord
  belongs_to :author
  belongs_to :genre

  has_many :reviews, dependent: :destroy
  has_many :order_items
  has_many :orders, through: :order_items

  validates :title, presence: true
  validates :price, numericality: { greater_than_or_equal_to: 0 }
  validates :stock_qty, numericality: { greater_than_or_equal_to: 0, only_integer: true }
end
