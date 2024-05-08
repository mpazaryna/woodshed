require 'rubygems'
require 'bundler'
Bundler.require

MongoMapper.connection = Mongo::Connection.new('127.0.0.1', 27017)
MongoMapper.database = "test1-#{RUBY_VERSION.gsub('.', '-')}"
MongoMapper.database.collections.each { |c| c.drop_indexes }

describe "A file"  do
  context 'has meta)' do
    it 'should write a file and get back meta information' do
      grid = Mongo::Grid.new(MongoMapper.database)
      file = File.open('image.jpg')
      id   = grid.put(file)
      z    = grid.get(id)
      z.read
      puts "filename #{z.filename}"
      puts "content_type #{z.content_type}"
      puts "metadata #{z.metadata}"
    end
  end
end