FactoryGirl.define do
  factory :device do
    name "foo"
    location "foo"
    guid "foo"
    ip "foo"
    hw_manufacturer "foo"
  end
  factory :network do
    name "foo"
    location "foo"
    guid "foo"
    logical_name "foo"
    ip_interface "foo"
  end
  
end