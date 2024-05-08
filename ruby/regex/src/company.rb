require 'rubygems'
require 'bundler'

Bundler.require
 
class Company
 
  # helper method for import verification
  # def self.verify_powerbar
  #   r = get_report_type("power-")
  # end

  # def self.verify_usage
  #   r = get_report_type("usage-")
  # end

  # def self.verify_vpls
  #   r = get_report_type("vpls-")
  # end

  def self.verify_powerbar
    r = get_report_type_two("power-")
  end

  def self.verify_usage
    r = get_report_type_two("usage-")
  end

  def self.verify_vpls
    r = get_report_type_two("vpls-")
  end

  # TODO: add vpls to the type
  def self.get_report_type(f)
    regex = Regexp.new(/power-/)
    matchdata = regex.match(f)
    if matchdata
      report_type = "powerbar"
    else
      report_type = "usage"
    end
    report_type
  end

  def self.get_report_type_two(f)
    if (f =~ /power(.*)/ )
      r = "powerbar"
    end
    if (f =~ /usage(.*)/ )
      r = "usage"
    end
    if (f =~ /vpls(.*)/ )
      r = "vpls"
    end
    r
  end

end