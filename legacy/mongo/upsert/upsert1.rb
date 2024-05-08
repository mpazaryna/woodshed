require 'mongo'
require 'json'

conn = Mongo::Connection.new
db   = conn['hills']
coll = db['user']

# remove specific 
# coll.find({:guid => "123456"}).each do |empty_doc|
#   coll.remove(empty_doc)
# end

# drop the collection so we know its empty
# coll.drop

puts "original data: "
coll.find().each { |row| puts row.inspect }
puts "---"

puts "create"
coll.update({"guid"=>"12346"},{:$set=>{"guid"=>"12346","email"=>"test1@example.com","company_guid"=>"ABCD1","portal_name"=>"sasuk","active"=>true, "widgets"=>[{"type"=>"devices_severities", "order"=>1, "id"=>1333558440}]}}, {upsert: true, safe: true})
coll.find().each { |row| puts row.inspect }
puts "----"

puts "upsert 1 - change email & portal, no widgets"
coll.update({"guid"=>"12346"},{:$set=>{"guid"=>"12346","email"=>"test2@example.com","company_guid"=>"ABCD2","portal_name"=>"sasuk","active"=>true}}, {upsert: true, safe: true})
coll.find().each { |row| puts row.inspect }
puts "---"

# puts "upsert 2 - change email & portal, with widgets"
# coll.update({"guid"=>"12346"},{"guid"=>"12346","email"=>"test3@example.com","portal_name"=>"sasuk1","active"=>true, "widgets"=>[{"type"=>"devices_severities", "order"=>1, "id"=>1333558440}]}, {upsert: true, safe: true})
# coll.find().each { |row| puts row.inspect }
# puts "---"

# puts "upsert 3 - change email & portal, no widgets"
# coll.update({"guid"=>"12346"},{"guid"=>"12346","email"=>"test4@example.com","portal_name"=>"sasuk2","active"=>false}, {upsert: true, safe: true})
# coll.find().each { |row| puts row.inspect }
# puts "---"

# coll.drop("tmpUsers")
# coll.rename("tmpUsers")
# puts db.collection_names

# coll.find().each { |row| puts row.inspect }

# coll.rename("user")
# coll.find().each { |row| puts row.inspect }

# def self.swap_device
#  Device.collection.drop
#  DeviceWorker.collection.rename("device")
# end