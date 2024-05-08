#!/usr/bin/env ruby
# encoding: utf-8

require "bunny"

# connect to RabbitMQ
conn = Bunny.new(:automatically_recover => false)
conn.start

# Next we create a channel, which is where most of the API for getting things done resides:
ch   = conn.create_channel
q    = ch.queue("hello")

# To send, we must declare a queue for us to send to; then we can publish a message to the queue
# Declaring a queue is idempotent - it will only be created if it doesn't exist already.
ch.default_exchange.publish("Hello World!", :routing_key => q.name)
puts " [x] Sent 'Hello World!'"

# Lastly, we close the connection;
conn.close