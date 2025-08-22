class Review < ApplicationRecord
  belongs_to :book
  belongs_to :user

  validates :rating, inclusion: { in: 1..5 }
  validates :user_id, uniqueness: { scope: :book_id }
  default_scope { order(created_at: :desc) }
end
