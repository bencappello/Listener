class ChangeCommentDataTypeToText < ActiveRecord::Migration
  def change
    change_column(:comments, :body, :text)
  end
end
