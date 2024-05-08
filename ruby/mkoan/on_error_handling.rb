require 'minitest/autorun'

class TestErrorHandling < MiniTest::Unit::TestCase

  def test_see_the_exception
    f = Foo.new
    r = f.throw_an_exception
    assert_equal "EXCEPTION", r
  end

  def test_no_exception
    f = Foo.new
    r = f.valid_yet_meaningless_method
    assert_equal 1, r
  end

end

class Foo

  def throw_an_exception
    begin
      c = 1/0 
    rescue
      c = 'EXCEPTION'
    end
  end

  def valid_yet_meaningless_method
    begin
      c = 1
    rescue
      c = 'EXCEPTION'
    end
  end
end