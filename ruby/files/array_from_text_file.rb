# array from text file
# File.open('blacklist.txt').each_line{ |s|
#   puts s
# }

array = Array.new
File.open('blacklist.txt').each_line{ |s|
  array.push s
}

array.each do|d|
  puts d
end