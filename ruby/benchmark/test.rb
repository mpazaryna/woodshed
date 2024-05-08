
require 'mongo'
require 'date'
include Mongo

num_inserts = 100000

if( ARGV.size() > 0 ) then
  num_inserts = ARGV[0].to_i()
end

db   = Connection.new.db('sample-db')
coll = db.collection('test')
coll.remove()
sleep(2)

puts "Testing #{num_inserts} inserts"
start = Time.now()
num_inserts.times do |i|
  coll.insert({'a' => i+1})
end

total = Time.now() - start
puts "Inserted #{coll.count()} records in #{total} seconds"