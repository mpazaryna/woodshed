require 'rubygems'
require 'bundler'
Bundler.require
require_relative "../src/power"

MongoMapper.connection = Mongo::Connection.new('127.0.0.1', 27017)
MongoMapper.database = "sgmc_dev"

describe "Power" do
  context 'populating drop down' do
    it "should count using where" do
      dat = Power.where(company_guid: "9AEE1A70-F16A-4624-A5CA-B5D3B6515931").count
      dat.should == 14
    end
    it "should count using distinct" do
      dat = Power.collection.distinct("company_guid", {:company_guid => "9AEE1A70-F16A-4624-A5CA-B5D3B6515931"})
      dat.count.should == 1
    end
    it "should create array of distinct areas by company" do
      dat = Power.find_distinct_area("9AEE1A70-F16A-4624-A5CA-B5D3B6515931")
      puts "distinct areas: #{dat}"
      dat.count.should == 1
    end
    it "should create array of distinct cabinets by company" do
      dat = Power.find_distinct_cabinet("9AEE1A70-F16A-4624-A5CA-B5D3B6515931")
      puts "distinct cabinets: #{dat}"
      dat.count.should == 7
    end
    it "should create a hash for cabinet drop down" do
      arr = Power.find_distinct_cabinet("9AEE1A70-F16A-4624-A5CA-B5D3B6515931")
      hash = Hash[arr.map {|x| [x, x]}]
      puts "cabinet hash: #{hash}"
    end
    it "should create a hash for area drop down" do
      arr = Power.find_distinct_area("9AEE1A70-F16A-4624-A5CA-B5D3B6515931")
      hash = Hash[arr.map {|x| [x, x]}]
      puts "area hash: #{hash}"
    end
  end
end