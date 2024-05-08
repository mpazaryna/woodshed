require_relative 'test_helper'
require './lib/attendee'

class AttendeeShouldaTest < MiniTest::Test
  context 'an attendee' do
        
    should 'exist' do 
      attendee = Attendee.new
      assert_kind_of Attendee, attendee
    end
        
    should 'change first names' do
      data = {:first_name => "George"}
      attendee = Attendee.new(data)
      assert_equal data[:first_name], attendee.first_name
      attendee.first_name = "Thomas"
      assert_equal "Thomas", attendee.first_name
    end    
      
    should 'cleans up phone number with periods and hyphens' do
      attendee = Attendee.new(:first_name => "Matt", :last_name => "Paz", :phone_number => "202.444-9382")
      assert_equal "Paz", attendee.last_name        
      assert_equal "2024449382", attendee.phone_number
    end    
      
    should 'throws away phone number that are too long' do
      attendee = Attendee.new(:phone_number => "23334445555")
      assert_equal "0000000000", attendee.phone_number
    end 
  end        
end