class CreateBlogs < ActiveRecord::Migration
  def change
    create_table :blogs do |t|
      t.string :name, null: false
      t.string :url, null: false

      t.timestamps
    end
  end
end
