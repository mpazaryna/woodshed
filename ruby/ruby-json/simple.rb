# simple mini test json example from stack overflow

require 'minitest/autorun'
require 'rest_client'
require 'json'

class APITest < MiniTest::Unit::TestCase
  def setup
    response = RestClient.get("http://ip.jsontest.com/") 
    @data = JSON.parse response.body
  end

  def test_id_correct
    assert_equal "54.224.72.30", @data['ip']
  end
end