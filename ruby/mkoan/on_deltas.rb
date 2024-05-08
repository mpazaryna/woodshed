require 'minitest/autorun'

# http://www.calculatorsoup.com/calculators/algebra/percentagechange.php
#
# What is the percentage change expressed as an increase or decrease for 3.50 to 2.625?
# Let V1 = 3.50 and V2 = 2.625 and plug numbers into our formula ((V2 - V1) / |V1|) * 100
# ((2.625 - 3.50) / |3.50|)*100
# = (-0.875 / 3.50) * 100
# = -0.25 * 100
# = -25% change

class TestDeltas < MiniTest::Unit::TestCase
  def test_1
    f = Foo.new
    assert_equal false, f.tolerable_change?(100,70)
  end  
  def test_2
    f = Foo.new
    assert_equal true, f.tolerable_change?(100,120)
  end
  def test_3
    f = Foo.new
    assert_equal false, f.tolerable_change?(100,20)
  end    
end

class Foo
  # tolerable delta gt or eq to
  FAIL = -10.00

  def tolerable_change?(v1,v2)
    # convert v1 and v2 to floats
    x = ((v2.to_f - v1.to_f) / v1.to_f.abs) * 100
    if x <= FAIL
      return false
    else
      return true
    end
  end
end