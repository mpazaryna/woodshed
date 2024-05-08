require 'minitest/autorun'

class TestRegularExpression < MiniTest::Unit::TestCase
  def test_no_exception
    f = Foo.new
    r = f.valid_yet_meaningless_method("usage-2011-01.txt")
    assert_equal "usage", r
  end
end

class Foo
  def valid_yet_meaningless_method(string1)
    regex = Regexp.new(/power-/)
    matchdata = regex.match(string1)
    if matchdata
      return "powerbar"
    else
      return "usage"
    end
  end
end