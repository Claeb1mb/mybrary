class Order < ApplicationRecord
  STATUSES = %w[pending completed cancelled].freeze

  belongs_to :user
  has_many :order_items, dependent: :destroy
  has_many :books, through: :order_items

  validates :status, inclusion: { in: STATUSES }

  after_initialize :set_default_status, if: :new_record?

  scope :pending, -> { where(status: "pending") }
  scope :completed, -> { where(status: "completed") }
  scope :cancelled, -> { where(status: "cancelled") }

  def total_price
    order_items.sum("order_items.quantity * order_items.unit_price")
  end

  def completed?
    status == "completed"
  end

  def pending?
    status == "pending"
  end

  def cancelled?
    status == "cancelled"
  end

  private

  def set_default_status
    self.status ||= "pending"
    self.order_date ||= Time.current
  end
end
