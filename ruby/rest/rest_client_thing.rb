require 'rubygems'
require 'json'
require 'rest_client'
require "benchmark"

class RestClientThing
  def parse_and_pretty_print(url)
    response = RestClient.get url
    data = JSON.parse(response.body)
    puts JSON.pretty_generate(data)
  end
end

describe RestClientThing, "review" do
  it "groups" do
    host = "http://localhost/api/"
    resource = 'groups'
    b = RestClientThing.new
    b.parse_and_pretty_print(host + resource)
  end
  it "groups/10" do
    host = "http://localhost/api/"
    resource = 'groups/10'
    b = RestClientThing.new
    b.parse_and_pretty_print(host + resource)
  end
  it "devices 1" do
    host = "http://localhost/api/"
    resource = 'devices'
    b = RestClientThing.new    
    b.parse_and_pretty_print(host + resource)
  end
  it "devices with benchmarking" do
    host = "http://sgmc.annlab.sgns.net/api/"
    resource = 'devices'
    b = RestClientThing.new    
    time = Benchmark.measure do
      b.parse_and_pretty_print(host + resource)
    end
    puts "Time elapsed #{time*1000} milliseconds"
  end
end