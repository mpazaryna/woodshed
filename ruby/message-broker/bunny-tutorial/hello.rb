#!/usr/bin/env ruby
# encoding: utf-8
# 
# http://rubybunny.info/articles/getting_started.html
# 
# This example demonstrates a very common communication scenario: application A wants to publish a message that will 
# end up in a queue that application B listens on. In this case, the queue name is "bunny.examples.hello_world".

require "rubygems"
require "bunny"

conn = Bunny.new
conn.start

ch = conn.create_channel

# Channels are opened on a connection. Bunny::Session#create_channel will return only when Bunny receives a confirmation 
# that the channel is open from RabbitMQ. 

# Declares a queue on the channel that we have just opened. Consumer applications get messages from queues. We declared this 
# queue with the "auto-delete" parameter. Basically, this means that the queue will be deleted when there are no more 
# processes consuming messages from it.

q  = ch.queue("bunny.examples.hello_world", :auto_delete => true)

# Instantiates an exchange. Exchanges receive messages that are sent by producers. Exchanges route messages to queues according 
# to rules called bindings. In this particular example, there are no explicitly defined bindings. The exchange that we use is 
# known as the default exchange and it has implied bindings to all queues. Before we get into that, let us see how we define 
# a handler for incoming messages

x  = ch.default_exchange

# Bunny::Queue#subscribe takes a block that will be called every time a message arrives. This will happen in a thread 
# pool, so Bunny::Queue#subscribe does not block the thread that invokes it.

q.subscribe do |delivery_info, metadata, payload|
  puts "Received #{payload}"
end

# Routing key is one of the message properties. The default exchange will route the message to a queue that has the same name 
# as the message's routing key. This is how our message ends up in the "bunny.examples.hello_world" queue.
 
x.publish("Hello, Matt", :routing_key => q.name)

sleep 1.0
conn.close