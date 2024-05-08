require 'unirest'

response = Unirest.post "http://costume-pepper.codio.io:1337/user", 
 headers:{ "Accept" => "application/x-www-form-urlencoded" }, 
parameters:{ :first_name => "Ruby", :last_name => "Rails", :email => "bar@example.com", :password => '123' }

response.code # Status code
response.headers # Response headers
response.body # Parsed body
response.raw_body # Unparsed body