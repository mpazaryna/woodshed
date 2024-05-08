# https://gist.github.com/2511099

require 'rubygems'
require 'active_record'
require 'benchmark/ips'
require 'yaml'
require 'logger'

dbconfig = YAML::load(File.open('database.yml'))
ActiveRecord::Base.establish_connection(dbconfig)
ActiveRecord::Base.logger = Logger.new(File.open('database.log', 'a'))

ActiveRecord::Base.connection.create_table('posts') do |t|
  t.string :name
  t.timestamps
end

class Post < ActiveRecord::Base
end

post = Post.create(:name => 'aaron')
id   = post.id

Benchmark.ips do |x|
  x.report("new")      { Post.new }
  x.report("new args") { Post.new(:name => 'aaron') }
  x.report("create")   { Post.create(:name => 'aaron') }
  x.report("find")     { Post.find(id) }
end