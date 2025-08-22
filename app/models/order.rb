class Order < ApplicationRecord
  STATUSES = %w[pending completed cancelled].freeze

  belongs_to :user
  has_many :order_items, dependent: :destroy
  has_many :books, through: :order_items
  validates :status, inclusion: { in: STATUSES }

  def total_price
    order_items.includes(:book).sum("order_items.quantity * books.price")
  end
end
