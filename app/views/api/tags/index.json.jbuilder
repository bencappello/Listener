json.array!(@tags) do |tag|
  json.extract!(tag, :id, :name, :created_at, :updated_at)
end
