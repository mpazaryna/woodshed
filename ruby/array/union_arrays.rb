require 'minitest/autorun'

class TestArrayThing < MiniTest::Unit::TestCase
  def setup
    @z = ArrayThing.new
  end
  # def test_array_is_complete
  #   fruit = ["apple", "banana", "cherry", "date", "grape", "mango"]
  #   assert_equal fruit, @z.combine_arrays
  # end
  def test_array_is_complete2
    fruit = ["apple", "banana", "cherry", "date", "grape", "mango"]
    assert_equal fruit, @z.combine_arrays_two
  end  
end

class ArrayThing
  # Union the array, dups are removed
  def combine_arrays
    list1 = ["apple", "banana", "cherry"]
    list2 = ["apple", "cherry", "date"]
    list3 = ["grape"]
    list4 = ["apple", "mango"]
    fruit = list1 | list2 | list3 | list4
  end
  def combine_arrays_two
    list1 = ["apple", "banana", "cherry"]
    list2 = ["apple", "cherry", "date"]
    list3 = ["grape"]
    list4 = ["apple", "mango"]
    list5 = []
    fruit = list1 | list2 | list3 | list4 | list5
  end
end