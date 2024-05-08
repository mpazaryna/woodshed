require 'rubygems'
require 'bundler'
Bundler.require

require_relative "../src/company"

describe "Data to be imported" do
  context 'new data is written' do
    it 'should regex on powerbar' do
      c = Company.verify_powerbar
      c.should == "powerbar"
    end
    it 'should regex on usage' do
      c = Company.verify_usage
      c.should == "usage"
    end
    it 'should regex on usage' do
      c = Company.verify_vpls
      c.should == "vpls"
    end
    it 'should regex out numbers' do
      c = " sd  190i.2912390123.aaabbcd".gsub(/[^a-zA-Z]/, '')
      c.should == "sdiaaabbcd"
    end
    it 'should regex out dashes from dates' do
      d = "1963-01-01"
      c = d.gsub(/[^0-9]/, '')
      c.should == "19630101"
      puts c
    end
  end
end