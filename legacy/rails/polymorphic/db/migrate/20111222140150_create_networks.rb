class CreateNetworks < ActiveRecord::Migration
  def change
    create_table :networks do |t|
      t.string :logical_name
      t.string :ip_inteface
      t.timestamps
    end
  end
end
