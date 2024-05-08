# http://www.skorks.com/2010/04/merging-ruby-hashes-and-bang-method-usage/

require 'minitest/autorun'

class TestRegularExpression < MiniTest::Unit::TestCase

  # should inject 1 
  def test_1
    b = ArrayThing.new
    arr = ["one","two","three"]
    c = b.inject_example_one(arr)
    v =  {"sort"=>"last_time", "dir"=>"desc", "query"=>[{"name"=>"device_name", "op"=>"eq", "value"=>"ausis1"}, {"name"=>"asset_guid", "op"=>"in", "value"=>["one", "two", "three"]}]}
    assert_equal c, v
  end

  # should inject 2 
  def test_2
    b = ArrayThing.new
    c = b.inject_example_two
    v =  {"sort"=>"last_time", "dir"=>"desc", "query"=>[{"name"=>"device_name", "op"=>"eq", "value"=>"ausis1"}]}
    assert_equal c, v
  end

  # should sort strings in an array" 
  def test_3
    b = ArrayThing.new
    c = b.sortIt
    v = ["1","2","3","4","5"]
    assert_equal c, v
  end

  # should calc the frequency of strings in an array
  def test_4
    b = ArrayThing.new
    c = b.calcIt
    v = {"1"=>1, "5"=>1, "2"=>1, "3"=>1, "4"=>1}
    assert_equal c, v
  end

  #  should calc the frequency of strings in an array" 
  def test_5 
    b = ArrayThing.new
    c = b.splitString
    v = [1, 2, 3, 4]
    assert_equal c, v
  end

  # should calc the frequency of strings in an array"
  def test_6 
    b = ArrayThing.new
    c = b.splitStringAndCalc
  end

  # should do the inject method
  def test_7
    b = ArrayThing.new
    c = b.injectCalc
  end

  def test_8
    # should make an array a string" do
    b = ArrayThing.new
    c = b.arrayToString
    puts c
  end
end


class ArrayThing  
  def inject_example_one(arr)
    body = {}
    body['sort'] = 'last_time'
    body['dir'] = 'desc'
    body['query'] ||= []
    body['query'] << {"name"=>'device_name',"op"=>'eq',"value"=>"ausis1"}
    body['query'] << {"name"=>'asset_guid',"op"=>'in',"value"=> arr}
    body   
  end
  
  def inject_example_two(arr=[])
    body = {}
    body['sort'] = 'last_time'
    body['dir'] = 'desc'
    body['query'] ||= []
    if arr.nil? || arr.empty?
      body['query'] << {"name"=>'device_name',"op"=>'eq',"value"=>"ausis1"}
    else
      body['query'] << {"name"=>'asset_guid',"op"=>'in',"value"=> arr}
    end
    body   
  end

  def sortIt
    array = Array.new
    array = ["1","5","2","3","4"]
    array.sort
  end

  def arrayToString
    a = ['12','34','35','231']
    a.map { |i| "'" + i.to_s + "'" }.join(",")
  end

  # make the hash default to 0 so that += will work correctly
  # http://stackoverflow.com/questions/569694/count-duplicate-elements-in-ruby-array 
  def calcIt
    a = ["1","5","2","3","4"]
    h = Hash.new(0)
    a.each do |v|
      h[v] += 1
    end
    h
  end
  
  def splitString
    a = Array.new
    a = "1,2,3,4".split(",").map { |s| s.to_i }
  end
  
  def splitStringAndCalc
    a = Array.new
    a = "1,1,1,1,1,1,1,1,1,2,3,4".split(",").map { |s| s.to_i }
    b = Hash.new(0)
    a.each do |v|
      b[v] += 1
    end
    b.each do |k, v|
      puts "#{k} appears #{v} times"
    end
  end

  # iterate over the array, counting duplicate entries  
  def injectCalc
    a = Array.new
    a = "1,1,1,1,1,1,1,1,1,2,3,4".split(",").map { |s| s.to_i }
    b = a.inject(Hash.new(0)) {|h,i| h[i] += 1; h }
    b.to_a.each {|error,count| puts "#{count}: #{error}" }
  end  
end
 