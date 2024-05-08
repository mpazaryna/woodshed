# http://www.skorks.com/2010/04/merging-ruby-hashes-and-bang-method-usage/
class HashThing

  def print_key_values
    h = {"Bob" => 82, "Jim" => 94, "Billy" => 58}
    h.each {|key, value| puts "#{key} is #{value}" }
  end

  def get_hash
    h = {"Bob" => 82, "Jim" => 94, "Billy" => 58}
  end
    
  def build_hash_with_array(arr)
    h = {}
    h['sort'] = 'last_time'
    h['dir'] = 'desc'
    h['query'] = {"name"=>'asset_guid',"op"=>'in',"value"=> arr}
    h.each {|key, value| puts "#{key} is #{value}" }
  end

  # body['query'] << {"name"=>'asset_guid',"op"=>'in',"value"=> user_asset_list}
  def inject_example(arr)
    body = {}
    body['sort'] = 'last_time'
    body['dir'] = 'desc'
    q = {"query"=>[{"name"=>'device_name',"op"=>'eq',"value"=>"ausis1"},{"name"=>'asset_guid',"op"=>'in',"value"=> arr}]}    
    body = body.merge(q)
    body.each {|key, value| puts "#{key} is #{value}" }    
  end

  # inject an array of user_assets into the body["query"] hash element
  #  q = {"query"=>[{"name"=>'device_name',"op"=>'eq',"value"=>"ausis1"},
  #      {"name"=>'asset_guid',"op"=>'in',"value"=> user_asset_list}]}
  # body['query'] << {"name"=>'asset_guid',"op"=>'in',"value"=> user_asset_list}  
  def inject_example_two(arr)
    body = {}
    body['sort'] = 'last_time'
    body['dir'] = 'desc'
    body['query'] ||= []
    body['query'] << {"name"=>'device_name',"op"=>'eq',"value"=>"ausis1"}
    body['query'] << {"name"=>'asset_guid',"op"=>'in',"value"=> arr}
    body.each {|key, value| puts "#{key} is #{value}" } 
    body   
  end    
end
 
describe HashThing, "#manipulate" do
  it "should print keys and values" do
    b = HashThing.new
    b.print_key_values
  end
  it "should get a hash" do
    b = HashThing.new
    e = {"Bob" => 82, "Jim" => 94, "Billy" => 58}
    h = b.get_hash
    h.should == (e)
  end
  it "should build a hash with an array" do
    b = HashThing.new
    arr = ["one","two","three"]
    b.build_hash_with_array(arr)
  end
  it "should inject" do
    b = HashThing.new
    arr = ["one","two","three"]
    b.inject_example(arr)
  end
  it "should inject2" do
    b = HashThing.new
    arr = ["one","two","three"]
    b.inject_example_two(arr)
    c = b.inject_example_two(arr)
    v =  {"sort"=>"last_time", "dir"=>"desc", "query"=>[{"name"=>"device_name", "op"=>"eq", "value"=>"ausis1"}, {"name"=>"asset_guid", "op"=>"in", "value"=>["one", "two", "three"]}]}
    c.should == v
  end
end