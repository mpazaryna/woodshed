class CreateNetworks < ActiveRecord::Migration
  def change
    create_table :networks do |t|
      t.string :name
      t.string :location
      t.string :guid
      t.string :logical_name
      t.string :ip_interface
      t.timestamps
    end
  end
end