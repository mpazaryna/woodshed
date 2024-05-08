#!/usr/bin/env ruby
# encoding: utf-8

require "bunny"

conn = Bunny.new(:automatically_recover => false)
conn.start

# Note that we declare the queue here, as well. Because we might start the receiver before the 
# sender, we want to make sure the queue exists before we try to consume messages from it.

ch   = conn.create_channel
q    = ch.queue("hello")

# We're about to tell the server to deliver us the messages from the queue. Since it will push us messages asynchronously, 
# we provide a callback that will be executed when RabbitMQ pushes messages to our consumer. 
# This is what Bunny::Queue#subscribe does.
# 
# Bunny::Queue#subscribe is used with the :block option that makes it block the calling 
# thread (we don't want the script to finish running immediately!).

begin
  puts " [*] Waiting for messages. To exit press CTRL+C"
  q.subscribe(:block => true) do |delivery_info, properties, body|
    puts " [x] Received #{body}"
  end
rescue Interrupt => _
  conn.close
  exit(0)
end