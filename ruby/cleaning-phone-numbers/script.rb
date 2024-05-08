require 'csv'
require_relative 'lib/attendee'

contents = CSV.open 'attendees.csv', headers: true, header_converters: :symbol
@attendee = Attendee.new

contents.each do |row|
  name = row[:first_name]
  email = row[:email]   
  phone_number = row[:phone_number]    
  attendee = Attendee.new(:first_name => "Matt", :last_name => "Paz", :phone_number => phone_number )
  new_phone_number = attendee.phone_number    
  puts "#{name} #{email} #{phone_number} #{new_phone_number}"
end
