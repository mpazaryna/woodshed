class Device < Ass
  # validations are inherited from the abstract class

  # override the abstract class method
  def get_name
  	return "this is a string from the device class"
  end

end
