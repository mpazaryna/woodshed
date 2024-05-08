class CalcTheNumber
  def calcIt
    # return is implied, no need to explicitly state it
    100 * 2
  end
end

describe "CalcTheNumber" do
  it "should say '200' when it receives the calcIt() message" do
    greeter = CalcTheNumber.new
    greeting = greeter.calcIt
    greeting.should == 200
  end
end