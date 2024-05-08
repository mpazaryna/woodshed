class Group
  include MongoMapper::Document
  
  key :name, String
  key :company_guid, String
  key :active, Boolean, default: true
  key :description, String
  key :asset_list, Array
  key :critical, Integer
  key :debug, Integer
  key :error, Integer
  key :information, Integer
  key :warning, Integer
  timestamps!
end