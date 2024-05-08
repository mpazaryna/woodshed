require 'minitest/spec'
require 'minitest/autorun'
require_relative "lib/string_thing"

describe StringThing do
  it "should produce a string" do
    b = StringThing.new
    z = ['one','two','three']
    a = b.build_string(z)
    a.must_equal "{name=>'asset_guid', op=>'in', value =>'one'},{name=>'asset_guid', op=>'in', value =>'two'},{name=>'asset_guid', op=>'in', value =>'three'}"
  end
end