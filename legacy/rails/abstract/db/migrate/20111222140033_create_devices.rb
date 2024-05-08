class CreateDevices < ActiveRecord::Migration
  def change
    create_table :devices do |t|
      t.string :name
      t.string :location
      t.string :guid
      t.string :ip
      t.string :hw_manufacturer
      t.timestamps
    end
  end
end