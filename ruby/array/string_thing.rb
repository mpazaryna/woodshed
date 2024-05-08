class StringThing

  # example of iterating through an array and returning a string
  def build_string(arr)
    i = 0
    s = ''
    arr.each do |x|
      i += 1
      if i <= (arr.length - 1) then
        s << "{name=>'asset_guid', op=>'in', value =>" + "'" + x + "'},"
      else
        s << "{name=>'asset_guid', op=>'in', value =>" + "'" + x + "'}"
      end
    end
    return s
  end
end

describe StringThing, "#manipulate" do
  it "should produce a string" do
    b = StringThing.new
    z = ['one','two','three']
    a = b.build_string(z)
    a.should == "{name=>'asset_guid', op=>'in', value =>'one'},{name=>'asset_guid', op=>'in', value =>'two'},{name=>'asset_guid', op=>'in', value =>'three'}"
  end
  it "should make an array a string" do
    b = StringThing.new
    z = ['one','two','three']
    a = z.join(",")
    a.should == "one,two,three"
  end
end