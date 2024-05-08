require 'timeframe'

describe Timeframe do

it "should return formatted dates for 6hour" do
  tf = Timeframe.new
  h = tf.calculate_start_end("6hour", Time.now)
  start_on = h[:sd]
  end_on = h[:ed]
  s = 6.hours.ago.strftime("%Y%m%d00:00").to_s
  e = Time.now.strftime("%Y%m%d00:00").to_s
  start_on.should == s
  end_on.should == e
end

it "should return formated start date for 6hour" do
  tf = Timeframe.new
  start_on = tf.calculate_start("6hour", Time.now)
  start_on.should == 6.hours.ago.strftime("%Y%m%d00:00").to_s
end

it "should return dates for 24 hours" do
  tf = Timeframe.new
  start_on = tf.calculate_start("day", Time.now)
  start_on.should == 24.hours.ago.strftime("%Y%m%d00:00").to_s
end

it "should return dates for a week" do
  tf = Timeframe.new
  start_on = tf.calculate_start("week", Time.now)
  start_on.should == 7.days.ago.strftime("%Y%m%d00:00").to_s
end

it "should return dates for a month" do
  tf = Timeframe.new
  start_on = tf.calculate_start("month", Time.now)
  start_on.should == 1.month.ago.strftime("%Y%m%d00:00").to_s
end

it "should return dates for six months" do
  tf = Timeframe.new
  start_on = tf.calculate_start("6months", Time.now)
  start_on.should == 6.month.ago.strftime("%Y%m%d00:00").to_s
end

it "should return dates for a month" do
  tf = Timeframe.new
  start_on = tf.calculate_start("month", Time.now)
  start_on.should == 1.month.ago.strftime("%Y%m%d00:00").to_s
end

it "should return dates for 24 hours if a bogus date period is added" do
  tf = Timeframe.new
  start_on = tf.calculate_start("dayglow", Time.now)
  start_on.should == 24.hours.ago.strftime("%Y%m%d00:00").to_s
end

end

