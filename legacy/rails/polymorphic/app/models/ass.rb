# With polymorphic associations, a model can belong to more than one other model, on a single association. 
# You can think of a polymorphic belongs_to declaration as setting up an interface that any other model can use.
#
# This migration can be simplified by using the t.references form:
#   t.references :assetable, :polymorphic => true
class Ass < ActiveRecord::Base
  belongs_to :assetable, :polymorphic => true
  validates_presence_of :name
  validates_presence_of :location
  validates_presence_of :guid
end