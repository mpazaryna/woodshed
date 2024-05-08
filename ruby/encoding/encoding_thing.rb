require 'open-uri'

# http://stackoverflow.com/questions/9214879/how-do-i-add-encoded-query-values-to-a-url

# q = URI.encode_www_form("show" => "Rosie & Jim", "series" => "3", "episode" => "4")
# u = URI::HTTP.new("http", nil, "mydomain.example", nil, nil, "/tv/ragdoll", nil, q, nil)
# puts q
# puts u

q1 = URI.encode_www_form("parent_id" => 0, "company_guid" => "9BF9C44F-3DCF-4770-8310-FD394C94AF77", "name"=>"spec_test", "active" => "true")
u1 = URI::HTTP.new("http", nil, "localhost", nil, nil, "/api/groups.json", nil, q1, nil)
puts q1
puts u1

# curl --data "parent_id=0&company_guid=9BF9C44F&name=spec_test&active=true" --url 'http://localhost/api/groups.json' > ~/curl-test-output.txt
