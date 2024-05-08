require 'mongo'
require 'json'

class Up
  def drop_collection
    conn = Mongo::Connection.new
    db   = conn['hills']
    coll = db['user']
    coll.drop
    0
  end

  def insert_one_record
    conn = Mongo::Connection.new
    db   = conn['hills']
    coll = db['user']
    coll.update({"guid"=>"12346"},{"guid"=>"12346","email"=>"test1@example.com","company_guid"=>"ABCD","portal_name"=>"sasuk","active"=>true, "widgets"=>[{"type"=>"devices_severities", "order"=>1, "id"=>1333558440}]}, {upsert: true, safe: true})
  end
  
end

# coll.find({:guid => 123456}).each do |empty_doc|
#   coll.remove(empty_doc)
# end
# coll.find().each { |row| puts row.inspect }
# coll.find({:guid => "123456"}).each do |empty_doc|
#  coll.remove(empty_doc)
# end    
# puts "original data: "
# coll.find().each { |row| puts row.inspect }
# puts "---"
# puts "first upsert"
# coll.update({"guid"=>"12346"},{"guid"=>"12346","email"=>"test1@example.com","company_guid"=>"ABCD","portal_name"=>"sasuk","active"=>true, "widgets"=>[{"type"=>"devices_severities", "order"=>1, "id"=>1333558440}]}, {upsert: true, safe: true})
# coll.find().each { |row| puts row.inspect }
# puts "----"
# puts "second upsert"
# coll.update({"guid"=>"12346"},{"guid"=>"12346","email"=>"test2@example.com","company_guid"=>"ABCD","portal_name"=>"sasuk","active"=>true, "widgets"=>[{"type"=>"devices_severities", "order"=>1, "id"=>1333558440}]}, {upsert: true, safe: true})
# coll.find().each { |row| puts row.inspect }
# puts "---"
# puts "third upsert"
# coll.update({"guid"=>"12346"},{"guid"=>"12346","email"=>"test2@example.com","portal_name"=>"sasuk","active"=>true, "widgets"=>[{"type"=>"devices_severities", "order"=>1, "id"=>1333558440}]}, {upsert: true, safe: true})
# coll.find().each { |row| puts row.inspect }
# puts "---"
# #coll.update({'guid'=>12346},{'guid'=>12346,'email'=>'test1@example.com','company_guid'=>'ABCD'}, {upsert: true, safe: true})
# #coll.find().each { |row| puts row.inspect }
