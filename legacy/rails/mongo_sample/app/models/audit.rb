class Audit
  include MongoMapper::Document
  key :action 
  key :auditable_type 
  key :audited_changes
  timestamps!
end