require 'rubygems'
require 'bundler'
Bundler.require
 
# {"CONTRACTING_GUID": null, "COMPANY_GUID": "0C25D95C-978E-4EE0-BE39-2C94D2177914", "NAME": "IPDUSASUKLTCA5CK29D", 
#  "CURRENT_RECORD": 1, "DC": "LTC", "PRODUCTION_STATE": "Installed-Active", "TAG_NUMBER": "IPDUSASUKLTCA5CK29D", 
#  "OWNER_GUID": "E71312DC-AAF1-4BF2-941D-B297B1D326AB", "PRIORITY": "0", "AREA": "A5", "LAST_MODIFIED": null, "LOCATION": 
#  "GB:HOUNSLOW.001", "ASSET_GUID": "002FC4E0-0CE4-495B-B926-200F3A4F004B", "TOTAL_RECORDS": 519, "SERIAL_NUMBER": "ZA0927016434", 
#  "CABINET": "CK29", "IP_ADDRESS": "10.132.205.16", "ASSET_TYPE": "pdu", "UNIT": "D"}
class Power
  include MongoMapper::Document
  key :contracting_guid
  key :company_guid
  key :name
  key :current_record
  key :dc
  key :production_state
  key :tag_number
  key :owner_guid
  key :priority
  key :area
  key :last_modified
  key :location
  key :asset_guid
  key :total_records
  key :serial_number
  key :cabinet
  key :ip_address
  key :asset_type
  key :unit
  timestamps!

  def self.find_distinct_area(company_guid)
    dat = Power.collection.distinct("area", {:company_guid => company_guid})
  end

  def self.find_distinct_cabinet(company_guid)
    dat = Power.collection.distinct("cabinet", {:company_guid => company_guid})
  end
end