require 'csv'
require_relative 'lib/email_util'

contents = CSV.open 'users.csv', headers: true, header_converters: :symbol
@eu = EmailUtil.new

contents.each do |row|
  name = row[:first_name]
  email = row[:email]    
  new_email = @eu.replace_domain(row[:email])
  puts "#{name} #{email} #{new_email}"
end
