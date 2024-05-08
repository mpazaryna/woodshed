require 'minitest/autorun'
require 'minitest/benchmark'
require 'mongo'
require 'json'

class TestMongo < MiniTest::Unit::TestCase
  # http://stackoverflow.com/questions/8752654/how-do-i-effectively-force-minitest-to-run-my-tests-in-order
  i_suck_and_my_tests_are_order_dependent!

  describe "when asked about subscriptions" do
    before do
      @m = Vp.new
    end
    it "should have a collection of users" do
      assert_equal 42417, @m.count_collection
    end
    it "should have a record in the subscription collection" do
      assert_equal 1, @m.create_subscription
    end
    it "should have a record in the statement collection" do
      assert_equal 1, @m.create_statement
    end
    it "should have records in device detail report worker" do
      assert_equal 5, @m.device_detail_report_worker
    end
    it "should have records in groups" do
      assert_equal 37, @m.groups
    end
    it "should have records in subaru groups" do
      assert_equal 5, @m.subaru_groups
    end

  end
end

class Vp
  def count_collection
    conn = Mongo::Connection.new
    db   = conn['sgmc_dev']
    coll = db['users']
    coll.count
  end
  def create_subscription
    conn = Mongo::Connection.new
    db   = conn['sgmc_dev']
    coll = db['subscriptions']
    coll.remove
    doc = {"company_snt"=>"suba","report_id"=>1,"email"=>"matt.pazaryna@example.com","frequency"=>'daily',"group_id"=>'1'}
    id = coll.insert(doc)
    coll.count
  end
  def create_statement
    conn = Mongo::Connection.new
    db   = conn['sgmc_dev']
    coll = db['statements']
    coll.remove
    doc = {"owner"=>"sung","name"=>"Device Detail","description"=>"Lorem epson","api"=>"http://ostools-api/device_detail"}
    id = coll.insert(doc)
    coll.count
  end
  def device_detail_report_worker
    conn = Mongo::Connection.new
    db   = conn['sgmc_dev']
    coll = db['device_detail_report_workers']
    coll.count
  end
  def groups
    conn = Mongo::Connection.new
    db   = conn['sgmc_dev']
    coll = db['groups']
    coll.count
  end
  def subaru_groups
    conn = Mongo::Connection.new
    db   = conn['sgmc_dev']
    coll = db['groups']
    coll.find("company_guid" => "D9EFA335-F8E5-4271-9541-BB5D7590AEE5").to_a
    coll.find.each { |row| puts row.inspect }
    coll.count
  end
end