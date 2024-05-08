FactoryGirl.define do
  factory :ass do
    name "Network device"
    location "Philadelphia"
    guid "asset-guid"
    assetable_id 1
    assetable_type "Device"
  end
  factory :device do
    ip "device-ip"
    hw_manufacturer "Sun"
  end
  factory :network do
    logical_name "phil01"
    ip_interface "sp-3/2/076"
  end  
end