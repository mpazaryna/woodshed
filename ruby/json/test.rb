# require 'csv'
# require 'json'

# csv_string = CSV.generate do |csv|
#   JSON.parse(File.open("foo.json").read).each do |hash|
#     csv << hash.values
#   end
# end

# puts csv_string

require 'json'
raise Exception, 'you must provide a json file' unless ARGV[0]

json = JSON.parse(File.open(ARGV[0]).read)
puts json.first.collect {|k,v| k}.join(',')
puts json.collect {|node| "#{node.collect{|k,v| v}.join(',')}\n"}.join
