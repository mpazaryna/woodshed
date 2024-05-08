require 'rubygems'
require 'bundler'
Bundler.require

require_relative "../src/power"
require_relative "../src/interface"

MongoMapper.connection = Mongo::Connection.new('127.0.0.1', 27017)
MongoMapper.database = "sgmc_dev"

describe "Interface" do
  context 'query' do
    it 'should count for a internet yes and billing yes' do
      f = {:$and => [{internet: "yes"},{usage: "yes"}]}
      c = Interface.where(f).all.count
      c.should == 7258
    end
    it 'should count for a company' do
      guid = "FF7DC028-509A-4845-A687-3E443DBD0096"
      f = {:$or => [{company_guid: guid},{contracting_guid: guid},{owner_guid: guid},{parent_guid: guid}]}
      rows = Interface.where(f).all.count
      rows.should == 6
    end
    it "should count for company and internet yes and billing yes" do
      guid = "FF7DC028-509A-4845-A687-3E443DBD0096"
      rows = Interface.where(:internet => 'yes', :usage => 'yes', 
        '$or' => [{:company_guid => guid},{:owner_guid => guid},{:parent_guid => guid}]).all.count
      rows.should == 6
    end
    it "should do a distinct network_name by company" do
      guid = "FF7DC028-509A-4845-A687-3E443DBD0096"
      f = {:$or => [{company_guid: guid},{contracting_guid: guid},{owner_guid: guid},{parent_guid: guid}]}
      dat = Interface.collection.distinct("network_name", f)
      puts "the val is now: #{dat}"
      dat.count.should <= 6
    end
    it "should do a distinct by company and internet yes and billing yes" do
      guid = "FF7DC028-509A-4845-A687-3E443DBD0096"
      rows = Interface.collection.distinct("network_name", :internet => 'yes', :usage => 'yes', 
        '$or' => [{:company_guid => guid},{:owner_guid => guid},{:parent_guid => guid}])
      rows.count.should == 1
    end
  end
  context 'dropdown' do
    it "should fetch distinct network_names (rd) for the dropdown" do
      guid = "FF7DC028-509A-4845-A687-3E443DBD0096"
      dat = Interface.report_dropdown(guid)
      puts "the val is now: #{dat}"
      dat.count.should == 1
    end
  end
end

# db.test.find({$or : [
#   {$and:[{"Date1": {"$exists": false}},{"Date2": {"$exists": false}}]},
#   {$and:[{"Date1": {"$exists": false}},{"Date2": {"$exists": true,"$lte": new Date("2012-01-07T04:45:52.057Z")}}]},
#   {$and:[{"Date2": {"$exists": false}},{"Date1": {"$exists": true,"$lte": new Date("2012-01-07T04:45:52.057Z")}}]},
#   {$and:[{"Date2": {"$exists": true,"$lte": new Date("2012-01-07T04:45:52.057Z")}},{"Date1": {"$exists": true,"$lte": new Date("2012-01-07T04:45:52.057Z")}}
# ]}]})

# dat = Interface.where(:internet => 'yes', :billing => 'yes', '$or' => [{:company_guid => "FF7DC028-509A-4845-A687-3E443DBD0096"},{:owner_guid => "FF7DC028-509A-4845-A687-3E443DBD0096"},{:parent_guid => "FF7DC028-509A-4845-A687-3E443DBD0096"}]).all

# <Interface _id: BSON::ObjectId('502015f60e6a510bdf0083d9'), billing: "yes", billing_port: "router", 
# company_guid: "FF7DC028-509A-4845-A687-3E443DBD0096", company_use: "STARS BOSTON", 
# contracting_guid: "8EF14CB4-7F67-4F0F-88A9-99DC470B1CB9", created_at: Mon, 06 Aug 2012 19:06:19 UTC +00:00, 
# description: "STARS Boston", device_guid: "A275F848-D035-1FDC-E040-A2A8567D39F0", device_name: "bursgspr5", 
# interface_id: "QupH4vbzEKkamsZ3QSDjvQ==", internet: "yes", ip_interface: "tunnel185614", logical_name: "BURSGSPR5.TUNNEL185614", 
# network_name: "RD.7381:1856", owner_guid: "8EF14CB4-7F67-4F0F-88A9-99DC470B1CB9", 
# parent_guid: "5D086DC1-A879-4E98-911D-F564828ECED8", standard_config: "yes", subtype: "router", 
# updated_at: Mon, 06 Aug 2012 19:06:19 UTC +00:00>, 
#
# <Interface _id: BSON::ObjectId('502015f60e6a510bdf0083da'), billing: "yes", billing_port: "router", 
# company_guid: "FF7DC028-509A-4845-A687-3E443DBD0096", company_use: "STARS BOSTON", 
# contracting_guid: "8EF14CB4-7F67-4F0F-88A9-99DC470B1CB9", created_at: Mon, 06 Aug 2012 19:06:19 UTC +00:00, 
# description: "STARS Boston", device_guid: "A275F848-D036-1FDC-E040-A2A8567D39F0", device_name: "bursgspr6", 
# interface_id: "PDAvN7NglN0DgBN5wYYQzA==", internet: "yes", ip_interface: "tunnel185611", logical_name: "BURSGSPR6.TUNNEL185611", 
# network_name: "RD.7381:1856", owner_guid: "8EF14CB4-7F67-4F0F-88A9-99DC470B1CB9", 
# parent_guid: "5D086DC1-A879-4E98-911D-F564828ECED8", standard_config: "yes", subtype: "router", 
# updated_at: Mon, 06 Aug 2012 19:06:19 UTC +00:00>, 
#
# <Interface _id: BSON::ObjectId('502015f60e6a510bdf0083db'), billing: "yes", billing_port: "router", 
# company_guid: "FF7DC028-509A-4845-A687-3E443DBD0096", company_use: "STARS BOSTON", 
# contracting_guid: "8EF14CB4-7F67-4F0F-88A9-99DC470B1CB9", created_at: Mon, 06 Aug 2012 19:06:19 UTC +00:00, 
# description: "STARS Boston", device_guid: "A275F848-D034-1FDC-E040-A2A8567D39F0", device_name: "hopsspir5", 
# interface_id: "ozhRKbIfZmq63PHzy5VwSQ==", internet: "yes", ip_interface: "tunnel185614", logical_name: "HOPSSPIR5.TUNNEL185614", 
# network_name: "RD.7381:1856", owner_guid: "8EF14CB4-7F67-4F0F-88A9-99DC470B1CB9", 
# parent_guid: "5D086DC1-A879-4E98-911D-F564828ECED8", standard_config: "yes", subtype: "router", 
# updated_at: Mon, 06 Aug 2012 19:06:19 UTC +00:00>, 
#
# <Interface _id: BSON::ObjectId('502015f60e6a510bdf0083dc'), billing: "yes", billing_port: "router", 
# company_guid: "FF7DC028-509A-4845-A687-3E443DBD0096", company_use: "STARS BOSTON", 
# contracting_guid: "8EF14CB4-7F67-4F0F-88A9-99DC470B1CB9", created_at: Mon, 06 Aug 2012 19:06:19 UTC +00:00, 
# description: "STARS Boston", device_guid: "A27A59CE-DA11-C7AD-E040-A2A8567D3E1E", device_name: "hopsspir6", 
# interface_id: "GsFBtOm6H_4rgXyjDIsA5w==", internet: "yes", ip_interface: "tunnel185611", logical_name: "HOPSSPIR6.TUNNEL185611",
# network_name: "RD.7381:1856", owner_guid: "8EF14CB4-7F67-4F0F-88A9-99DC470B1CB9", 
# parent_guid: "5D086DC1-A879-4E98-911D-F564828ECED8", standard_config: "yes", subtype: "router", 
# updated_at: Mon, 06 Aug 2012 19:06:19 UTC +00:00>, 
#
# <Interface _id: BSON::ObjectId('502015f60e6a510bdf0083dd'), billing: "yes", billing_port: "router", 
# company_guid: "FF7DC028-509A-4845-A687-3E443DBD0096", company_use: "STARS BOSTON", 
# contracting_guid: "8EF14CB4-7F67-4F0F-88A9-99DC470B1CB9", created_at: Mon, 06 Aug 2012 19:06:19 UTC +00:00, 
# description: "STARS Boston", device_guid: "8B30F676-B7CD-E3EC-E040-A2A8567D7367", device_name: "vorir5", 
# interface_id: "QNVyPiV_UbgB51kTxNspeg==", internet: "yes", ip_interface: "tunnel185614", logical_name: "VORIR5.TUNNEL185614", 
# network_name: "RD.7381:1856", owner_guid: "8EF14CB4-7F67-4F0F-88A9-99DC470B1CB9", 
# parent_guid: "5D086DC1-A879-4E98-911D-F564828ECED8", standard_config: "yes", subtype: "router", 
# updated_at: Mon, 06 Aug 2012 19:06:19 UTC +00:00>, 
#
# <Interface _id: BSON::ObjectId('502015f60e6a510bdf0083de'), billing: "yes", billing_port: "router", 
# company_guid: "FF7DC028-509A-4845-A687-3E443DBD0096", company_use: "STARS BOSTON", 
# contracting_guid: "8EF14CB4-7F67-4F0F-88A9-99DC470B1CB9", created_at: Mon, 06 Aug 2012 19:06:19 UTC +00:00, 
# description: "STARS Boston", device_guid: "8B30F676-B7CE-E3EC-E040-A2A8567D7367", device_name: "vorir6", 
# interface_id: "Sxvc00qj7oxyfFWR2r1Dag==", internet: "yes", ip_interface: "tunnel185611", logical_name: "VORIR6.TUNNEL185611", 
# network_name: "RD.7381:1856", owner_guid: "8EF14CB4-7F67-4F0F-88A9-99DC470B1CB9", 
# parent_guid: "5D086DC1-A879-4E98-911D-F564828ECED8", standard_config: "yes", subtype: "router", 
# updated_at: Mon, 06 Aug 2012 19:06:19 UTC +00:00>] 