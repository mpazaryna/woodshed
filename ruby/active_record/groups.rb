require 'rubygems'
require 'active_record'
require 'yaml'
require 'logger'

dbconfig = YAML::load(File.open('database.yml'))
ActiveRecord::Base.establish_connection(dbconfig)
ActiveRecord::Base.logger = Logger.new(File.open('database.log', 'a'))

class Group < ActiveRecord::Base
  has_many :groups_assets, dependent: :destroy
  has_many :assets, :class_name => 'GroupsAsset', select: 'asset_guid',  :dependent => :destroy
end

class GroupsAsset < ActiveRecord::Base
  belongs_to  :group
end

# incoming will be
# # {"asset_list":["31F9A921-E833-4B86-9BC4-9118F9FF4ADF","772B87DE-2CFB-BAEE-E040-A2A8567D054B","8494B339-B18A-455D-B844-6C21EA43381F",
#    "9B767CEE-DAE2-CDB8-E040-A2A8567D0EC9","69DB0203-8CE8-0C99-E040-A2A8567D4D9B","65B949D3-D415-8ECE-E040-A2A8567D1A4C",
#    "86041384-ABA8-C6DD-E040-A2A8567D629C"],"name":"bubba2"}

# collection.build(attributes = {}, …) Returns one or more new objects of the collection type that have been instantiated with attributes 
# and linked to this object through a foreign key, but have not yet been saved. Note: This only works if an associated object already exists, 
# not if it‘s nil!
#
# This means we can use the build method to add a record into a :has_many relationship before either record has been saved 

class GroupThing

  def test_two
    hGroup = Hash.new
    hGroup["name"] = "bubba2"
    hGroup["company_guid"] = "51a3a56c-c38a-4206-b98a-d96cf6016729"
    g = Group.new
    g.name = hGroup["name"]
    g.company_guid = hGroup["company_guid"]
    assets = ["31F9A921-E833-4B86-9BC4-9118F9FF4ADF","772B87DE-2CFB-BAEE-E040-A2A8567D054B"]
    assets.each do |a|
      g.assets.build(asset_guid: a)
    end
    g.save
    puts g.id
  end

  # for an array of integers, delete from groups
  def test_delete
    g = [22058]
    Group.delete(g)
  end 
end
  
t = GroupThing.new
# t.test_two
t.test_delete