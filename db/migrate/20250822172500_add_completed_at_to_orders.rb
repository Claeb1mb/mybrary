class AddCompletedAtToOrders < ActiveRecord::Migration[7.2]
  def change
    add_column :orders, :completed_at, :datetime
  end
end
