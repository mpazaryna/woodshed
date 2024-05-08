require 'minitest/autorun'
require 'minitest/benchmark'
require 'mongo'
require 'json'

class TestMongo < MiniTest::Unit::TestCase
  describe "when asked about mongo" do

    before do
      @m = Up.new
    end

    it "should remove the connection" do
      assert_equal 0, @m.drop_collection
    end

    it "should update the record" do
      h = {"updatedExisting"=>true, "n" => 1, "connectionId" => 447, "err" => nil, "ok" => 1.0}
      assert_equal h, @m.insert_one_record
    end
  end
end

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