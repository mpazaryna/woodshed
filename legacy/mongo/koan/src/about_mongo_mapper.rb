# require 'rubygems'
# require 'mongo'
# require 'minitest/benchmark'
require 'minitest/autorun'
require 'mongo_mapper'

MongoMapper.connection = Mongo::Connection.new('127.0.0.1', 27017)
db = "sgmc_dev"
MongoMapper.database = db 

class TestMongo < MiniTest::Unit::TestCase
  # http://stackoverflow.com/questions/8752654/how-do-i-effectively-force-minitest-to-run-my-tests-in-order
  i_suck_and_my_tests_are_order_dependent!

  describe "verify subaru user" do
    it "should be correct" do
      g = User.where(email: "zlin@subaru.com").all
      z = g.count
      assert_equal 1, z
    end
  end

  describe "verify subaru groups" do
    it "should be correct" do
      g = Group.where(company_guid: "D9EFA335-F8E5-4271-9541-BB5D7590AEE5").all
      z = g.count
      assert_equal 5, z
    end
  end

#   describe "add some statement data" do
#     before do
#       @statement = Statement.create(
#         :owner => 'sung', 
#         :name => 'Device Detail', 
#         :description =>'Lorem epson', 
#         :api => 'http://ostools-api/device_detail'
#       )
#       @statement.save
#     end
#     it "should be correct" do
#       z = Statement.all.count
#       assert_equal 1, z
#     end
#   end

#   describe "add some subscription data" do
#     before do
#       @subscription = Subscription.create(
#         :company_snt => 'suba', 
#         :report_id => 1, 
#         :email => 'matt.pazaryna@sungard.com',
#         :frequency => 'daily',
#         :group_id => '1' 
#       )
#       @subscription.save
#     end
#     it "should be correct" do
#       z = Subscription.all.count
#       assert_equal 1, z
#     end
#   end

end

class Statement
  include MongoMapper::Document
end

class User
  include MongoMapper::Document
end

class Subscription
  include MongoMapper::Document
end

class Group
  include MongoMapper::Document
end