require 'minitest/autorun'
require 'mongo'

class TestRenameCollections < MiniTest::Unit::TestCase

  # http://stackoverflow.com/questions/8752654/how-do-i-effectively-force-minitest-to-run-my-tests-in-order
  i_suck_and_my_tests_are_order_dependent!

  SEED = 111
  LOAD = 210

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

  # Rename and assert that prod collection eq LOAD count
  def test_3
    f = Foo.new
    r = f.rename
    z = f.count_collection("device")
    assert_equal LOAD, z
  end
end

# In order to rename a Mongo collection, there cannot be an existing name for the collection
# Once renamed, a test is run to ensure the row counts equal each other
class Foo

  def bulk_load(rows, collection)

    # connect to mongo
    conn = Mongo::Connection.new
    db = conn['myDb2']
    coll = db[collection]

    # remove method will delete documents
    coll.remove

    # loop and create new data  
    rows.times do |i|
      coll.insert({'_id' => "#{i+1}", 'data' => "test" })
    end

    # return collection count
    coll.count
  end

  def rename
    conn = Mongo::Connection.new
    db = conn['myDb2']

    # make sure the tmp does not exist
    tmp = db['device_tmp']
    tmp.drop

    # rename 
    prod = db['device']
    prod.rename("device_tmp")

    # drop prod_collection
    prod.drop
 
    # rename worker to prod_collection
    worker = db['device_worker']
    worker.rename("device")
    true
  end

  def count_collection(collection)
    conn = Mongo::Connection.new
    db = conn['myDb2']
    c = db[collection]
    c.count
  end   
end