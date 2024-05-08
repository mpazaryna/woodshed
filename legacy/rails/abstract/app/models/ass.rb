# Abstract AR classes aren't used directly, just inherited from
# An abstract model means you can inherit from it without using STI.
# Class and instance methods are shared down the inheritance hierarchy 

class Ass < ActiveRecord::Base

  # tells ActiveRecord that there is not a database table associated with that class
  # inherited classes will each have their own database table. 	
  self.abstract_class = true  
  
  # set validations at the abstract class level
  validates_presence_of :name
  validates_presence_of :location
  validates_presence_of :guid

  def get_name
  	return "this is a string from the abstract class"
  end

end