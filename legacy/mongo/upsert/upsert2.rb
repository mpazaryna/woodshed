# upsert

require 'mongo'
require 'json'

conn = Mongo::Connection.new
db   = conn['hills']
coll = db['user_2']

# https://groups.google.com/forum/?fromgroups#!topic/mongodb-user/p95BLm7EShI

# <User _id: BSON::ObjectId('4f74dda1e1b7270bfe0675b7'),
# active: true, 
# app_settings: {"widgets"=>[{"type"=>"devices_severities", "order"=>1, "id"=>1333468855}]},
# company_guid: "E71312DC-AAF1-4BF2-941D-B297B1D326AB", 
# created_at: Thu, 29 Mar 2012 22:09:36 UTC +00:00, 
# email: "matt.pazaryna@sungard.com", 
# guid: "EBE7DBEE-EF49-4576-9216-186466CB29A3", 
# portal_name: "sasuk", 
# updated_at: Tue, 03 Apr 2012 16:00:55 UTC +00:00> 

coll.update({'guid'=>12346},{'guid'=>12346,'email'=>'test1@example.com','company_guid'=>'ABCD','portal_name'=>'sasuk','active'=>true}, {upsert: true, safe: true})
# coll.update({'guid'=>12346},{'guid'=>12346,'email'=>'test1@example.com','company_guid'=>'ABCD','portal_name'=>'sasuk'}, {upsert: true, safe: true})

# coll.update(doc, upsert: true, safe: true)
# Report.collection.update({meta_object_type:report_type,company_guid:c.guid,start_date:start_date,end_date:end_date}, { :$set => {total:data.size,created_at:Time.now,updated_at:Time.now}},upsert: true, safe: true)

# my_doc = coll.find_all()
# puts my_doc.inspect

coll.find().each { |row| puts row.inspect }