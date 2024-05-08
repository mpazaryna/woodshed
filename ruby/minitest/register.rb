# http://rubylearning.com/blog/2011/07/28/how-do-i-test-my-code-with-minitest/

require 'minitest/autorun'

class TestCashRegister < MiniTest::Unit::TestCase
  def setup
    @register = CashRegister.new
  end
  def test_default_is_zero
    assert_equal 0, @register.total
  end
end

class CashRegister
  def total
    0
  end
end