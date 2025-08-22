class User < ApplicationRecord
  has_secure_password
  has_many :orders, dependent: :destroy
  has_many :reviews, dependent: :destroy

  validates :full_name, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false }
end
