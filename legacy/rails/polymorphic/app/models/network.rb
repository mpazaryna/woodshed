class Network < ActiveRecord::Base
  has_one :ass, :as => :assetable
end
