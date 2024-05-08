require 'rubygems'
require 'active_record'
require 'yaml'
require 'logger'

dbconfig = YAML::load(File.open('database.yml'))
ActiveRecord::Base.establish_connection(dbconfig)
ActiveRecord::Base.logger = Logger.new(File.open('database.log', 'a'))

class User < ActiveRecord::Base
end

puts User.count
# SQL (0.000277)   SELECT count(*) AS count_all FROM users