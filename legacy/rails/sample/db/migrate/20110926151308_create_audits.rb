class CreateAudits < ActiveRecord::Migration
  def change
    create_table :audits do |t|
      t.string :controller_name
      t.string :action_name
      t.float :duration
      t.timestamps
    end
  end
end
