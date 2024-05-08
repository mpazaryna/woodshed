# file: test/test_helper.rb
require 'minitest/autorun'
require 'minitest/reporters' # requires the gem
require 'shoulda/context'
 
Minitest::Reporters.use! Minitest::Reporters::SpecReporter.new # spec-like progress