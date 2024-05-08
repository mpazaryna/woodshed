class Person < ActiveRecord::Base

  def my_logger
    @@my_logger ||= Logger.new("#{Rails.root}/log/my.log")
  end

  def before_save
    my_logger.info("Creating user with name #{self.name}")
  end

end
