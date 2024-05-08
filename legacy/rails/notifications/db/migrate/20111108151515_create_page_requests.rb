class CreatePageRequests < ActiveRecord::Migration
  def change
    create_table :page_requests do |t|
      t.string :path
      t.float :page_duration
      t.float :view_duration
      t.float :db_duration
      t.timestamps
    end
  end
end
