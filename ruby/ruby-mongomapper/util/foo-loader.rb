require 'mongo_mapper'
 
MongoMapper.database = 'tmp'
 
class Foo
  include MongoMapper::Document
  key :name, String
end

Foo.collection.remove
 
8.times { Foo.create(:name => 'foo', :email => "test@sungardas.com")}
8.times { Foo.create(:name => 'bar', :email => "test@sungard.com") }
 
puts "Total       : #{MongoMapper.database.eval('db.foos.count()')}"
puts "name = foo  : #{MongoMapper.database.eval('db.foos.count({name: \'foo\'})')}"
puts "name = ''   : #{MongoMapper.database.eval('db.foos.count({name: \'\'})')}"
puts "name = null : #{MongoMapper.database.eval('db.foos.count({name: null})')}"
