class CreateAsses < ActiveRecord::Migration
  def change
    create_table :asses do |t|
      t.string :name
      t.string :location
      t.string :guid
      t.references :assetable, :polymorphic => true
	  t.timestamps
    end
  end
end
