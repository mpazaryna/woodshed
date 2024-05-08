require_relative 'test_helper'
require './lib/report'
require 'json'

class ReportTest < MiniTest::Test
      
  #override random test run ordering
  i_suck_and_my_tests_are_order_dependent!
    
  context 'a report' do  
            
    # report based on device    
    should 'return device availability message' do
     data = {
              :user_guid => "0123af", 
              :company_guid => "134dfaa", 
              :report_name => "company_availability_report", 
              :destination => 'mailto://joe.user@sungardas.com',
              :device => "phlnu422",
              :start_date => "2041201",
              :end_date => "20141231"
            }
     r = Report.new(data)
     dat = r.device_json    
     dat = JSON.parse dat     
     assert_equal data[:device], dat["device"]
     assert_equal data[:start_date], dat["start"]
     assert_equal data[:end_date], dat["end"]
     assert_equal data[:destination], dat["destination"]  
     assert_equal data[:report_name], dat["type"]         
     assert_equal "viewpoint", r.app_id     
     assert_equal "report.job.create.cust2", r.routing_key   
     # assert wont_be_nil r.report_guid     
    end     

    # report based on company, not device    
    should 'return company availability message' do
     data = {
              :user_guid => "0123af", 
              :company_guid => "134dfaa", 
              :report_name => "company_availability_report", 
              :destination => 'pyxie://<path/in/pyxie>',
              :start_date => "2041201",
              :end_date => "20141231",
              :company_guid => ["a3f72a77-0be7-4340-84e9-e882dd8a1c79","08314537-a12e-460a-b6e9-8a34da239aec"]
            } 
     r = Report.new(data)
     dat = r.company_json    
     dat = JSON.parse dat     
     assert_equal data[:start_date], dat["start"]
     assert_equal data[:end_date], dat["end"]
     assert_equal data[:company_guid], dat["company_guid"]  
     assert_equal data[:destination], dat["destination"]  
     assert_equal data[:report_name], dat["type"]         
     assert_equal "viewpoint", r.app_id     
     assert_equal "report.job.create.cust2", r.routing_key   
     # assert wont_be_nil r.report_guid     
    end     
            
  end        
end