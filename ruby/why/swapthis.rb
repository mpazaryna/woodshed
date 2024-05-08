# a hash
# words placed before the arrow are keys
# words placed after the arrow are values
code_words = {
  'starmonkey' => 'bad ass mofo',
  'soft_shell' => 'another bad ass'
}

print "Enter your evil idea: "
idea = gets

# gsub is short for 'global substitution', the method is used to search and replace
# find the occurence of a dangerous word and replace it with the safe word 
code_words.each do |real,code|
  
  # the exclamation mark indicates that gsub is going to replace the word directly
  # the old string will be gone
  idea.gsub!(real,code)
end

# request a new file name
print "file encoded. enter a name: "

# strip will trim spaces and blank lines from the beginning to the end of the string, 
# it will also remove the enter
idea_name = gets.strip

# opens a new blank text file
# named by adding strings
# pass the File class a name 
# the w option, indicates a new file
File::open("idea-" + idea_name + ".txt","w") do |f|
  # using the concatenate operator write the data to the variable f
  f << idea
end

# print out the idea
# Dir is a class method, that searches a directory
# match anything that starts with idea- and ends with .txt
# return that list in an array 
# cycle through the array in the do block
Dir['idea-*.txt'].each do |file_name|
  idea = File.read(file_name)
  code_words.each do |key,value|
    idea.gsub!(value,key)
  end
  puts idea
end
  