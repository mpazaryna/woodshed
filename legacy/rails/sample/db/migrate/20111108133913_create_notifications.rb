class CreateNotifications < ActiveRecord::Migration
  def change
    create_table :notifications do |t|
      t.string :path
      t.float :page_duration
      t.float :view_duration
      t.float :db_duration
      t.text :payload

      t.timestamps
    end
  end
end
