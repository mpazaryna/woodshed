require 'minitest/autorun'

class TestArrayThing < MiniTest::Unit::TestCase
  def setup
    @z = ArrayThing.new
  end
  def test_three
    fruit = ["apple1", "apple2"]
    assert_equal fruit, @z.test_three
  end
end

class ArrayThing

  def test_three
    fruit = []
    names = %w[1 2]
    names.length.times do |i|
      y = get_new_name(names[i])
      fruit << y
    end
    fruit
  end

  def get_new_name(x)
    "apple" + x.to_s
  end
end