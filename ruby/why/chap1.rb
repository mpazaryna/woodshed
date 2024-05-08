# Say in comments each part of speech used in this example.

# A method called 'require' is used, a string is passed to the method
# We are telling Ruby to load the Net::HTTP and minitest libraries 
require 'net/http'
require 'minitest/autorun'

# We are creating a class that extends MiniTest::Unit::TestCase
class TestHttpGet < MiniTest::Unit::TestCase
  
  # A method from MiniTest library, it runs each time a test is executed
  def setup
    @browser = MyFakeBrowser.new
  end
  
  # My test method to exercise the MyFakeBrowser.getPage method 
  def _test_body
    assert_equal 0, @browser.getBody
  end
  
  # My test method to exercise the MyFakeBrowser.getResponse method 
  def test_response
    z = @browser.getResponse
    assert_equal "200", @browser.getResponse
  end
  
end

class MyFakeBrowser
  # Net::HTTP is a constant refering to the loaded library
  # We are using the method 'start' from the library
  # Into the method we're sending a string and the number 80
  #
  # the word do opens a block
  # the block has one variable 'http'
  # inside the block the method print is called
  #
  # from the variable http, the method get is called
  # into get we pass a string containing a path
  # another method is chained onto get, the method body
  # then the block closes with end
  def getBody
    Net::HTTP.start('www.glowsalon.com',80) do |http|
      v = (http.get('/services.html').body)
    end
  end
  
  # def is a method definition, a plain kernel method that can 
  # be used anywhere in ruby
  def getResponse 
    
    # a variable to hold a URI string passed to Net::HTTP get_response
    uri = URI('http://www.glowsalon.com/services.html')
    
    # a variable that captures the results of Net::HTTP get_response 
    res = Net::HTTP.get_response(uri)
        
    # If the code is 200 use the kernel method print to display a message
    if res.code == 200
      print "dang, this is chunky bacon"
    end
    
    # return the response code
    res.code
  end
end