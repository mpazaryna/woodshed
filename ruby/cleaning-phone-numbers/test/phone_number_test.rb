require_relative 'test_helper'
require './lib/phone_number'

class PhoneNumberTest < MiniTest::Unit::TestCase
  context 'a phone number' do     

  should 'exist' do 
    pn = PhoneNumber.new
    assert_kind_of PhoneNumber, pn
  end
  
  should 'clean up phone numbers with periods and hyphens' do
    pn = PhoneNumber.new(:phone_number => "202.444-9382")
    assert_equal "2024449382", pn.phone_number
  end    
      
  should 'remove leading one from an eleven digit phone number' do
    pn = PhoneNumber.new(:phone_number => "12024449382")
    assert_equal "2024449382", pn.phone_number
  end    
  
  should 'throw away phone numbers that are too long' do
    pn = PhoneNumber.new(:phone_number => "23334445555")
    assert_equal "0000000000", pn.phone_number
  end 
      
  should 'throw away phone numbers that are too short' do
    pn = PhoneNumber.new(:phone_number => "222333444")
    assert_equal "0000000000", pn.phone_number
  end  
 
  should 'not modify phone numbers that are as expected' do
    pn = PhoneNumber.new(:phone_number => "2223334444")
    assert_equal "2223334444", pn.phone_number
  end  
        
      
  end      
end