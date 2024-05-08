class Bowling
  def hit(pins)
  end
  
  def score
    0
  end
  
  def test_array
    a = ["one","two","three"]
    return a
  end
end

describe Bowling, "#score" do

  it "returns 0 for all gutter game" do
    bowling = Bowling.new
    20.times { bowling.hit(0) }
    bowling.score.should eq(0)
  end

  it "returns 3 for array length" do
    b = Bowling.new
    v = b.test_array
    v.length.should eq(3)
  end

  it "returns 4 for array length" do
    b = Bowling.new
    v = b.test_array
    v.length.should eq(9)
  end
  
end
