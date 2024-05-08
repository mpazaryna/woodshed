#!/usr/bin/env ruby
# encoding: utf-8

require "bunny"
require "json"
require 'securerandom'

# connect to RabbitMQ
conn = Bunny.new(:automatically_recover => false)
conn.start

# Next we create a channel, which is where most of the API for getting things done resides:
ch   = conn.create_channel
q = ch.queue("report.job.create")

# To send, we must declare a queue for us to send to; then we can publish a message to the queue
# Declaring a queue is idempotent - it will only be created if it doesn't exist already.

company_guid = SecureRandom.uuid #=> "62936e70-1815-439b-bf89-8492855a7e6b"

now = Time.now
report_request = {:type => "device_pdf_report", 
                  :device =>["phlnu422","phlnu423","phlnu424"],
                  :start =>"20140901",
                  :end => "20140930", 
                  :destination => "#{company_guid}-usage-reports/filename"}

report_request.to_json

ch.default_exchange.publish(report_request.to_json,
          :routing_key => q.name,
          :app_id      => "vpdev",
          :priority    => 8,
          :type        => "report.job.create",
          :delivery_mode => 1,
          :timestamp      => now.to_i,
          :message_id     => "generateGuid")

puts " [x] Sent 'Hello World!'"

# Lastly, we close the connection;
conn.close