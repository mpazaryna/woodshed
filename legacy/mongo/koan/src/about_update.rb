require 'minitest/autorun'
require 'mongo'

class TestUpdateCollections < MiniTest::Unit::TestCase

  # http://stackoverflow.com/questions/8752654/how-do-i-effectively-force-minitest-to-run-my-tests-in-order
  i_suck_and_my_tests_are_order_dependent!

  SEED = 10
  LOAD = 10

  # load prod table with SEED count
  def test_1
    f = Foo.new
    z = f.bulk_load(SEED, "device")
    assert_equal SEED, z
  end

  # load worker table with LOAD count
  def test_2
     f = Foo.new
     z = f.bulk_load(LOAD, "device_worker")
     assert_equal LOAD, z
  end

  # load worker table with LOAD count
  def test_3
     f = Foo.new
     z = f.iterate_collection("device_worker")
     assert_equal LOAD, z
  end

  # load worker table with LOAD count
  def test_4
     f = Foo.new
     z = f.update_collection("device_worker")
     assert_equal LOAD, z
  end

  # load worker table with LOAD count
  def test_5
     f = Foo.new
     z = f.iterate_collection("device_worker")
     assert_equal LOAD, z
  end

end

# In order to rename a Mongo collection, there cannot be an existing name for the collection
# Once renamed, a test is run to ensure the row counts equal each other
class Foo

  def bulk_load(rows, collection)
    conn = Mongo::Connection.new
    db = conn['myDb2']
    coll = db[collection]

    # remove collection
    coll.remove

    # insert data  
    rows.times do |i|
      coll.insert({'_id' => "#{i+1}", 'data' => "test" })
    end

    # return collection count
    coll.count
  end

  def count_collection(collection)
    conn = Mongo::Connection.new
    db = conn['myDb2']
    c = db[collection]
    c.count
  end

  def iterate_collection(collection)
    conn = Mongo::Connection.new
    db = conn['myDb2']
    c = db[collection]
    c.find().each { |row| puts row.inspect }  
    c.count
  end   

  def update_collection(collection)
    conn = Mongo::Connection.new
    db = conn['myDb2']
    c = db[collection]
    c.update({:_id => 1}, {"$set" => {"name" => "MongoDB Ruby"}})
    c.count
  end

end
