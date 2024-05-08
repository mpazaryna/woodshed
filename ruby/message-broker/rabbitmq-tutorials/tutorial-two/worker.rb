#!/usr/bin/env ruby
# encoding: utf-8

require "bunny"

conn = Bunny.new(:automatically_recover => false)
conn.start

ch   = conn.create_channel

# When RabbitMQ quits or crashes it will forget the queues and messages unless you tell it not to. Two things are required to make sure 
# that messages aren't lost: we need to mark both the queue and messages as durable.
#
# First, we need to make sure that RabbitMQ will never lose our queue. In order to do so, we need to 
# declare it as durable:

q    = ch.queue("task_queue", :durable => true)

ch.prefetch(1)
puts " [*] Waiting for messages. To exit press CTRL+C"

begin
      
  # Message acknowledgments are turned off by default. It's time to turn them on using the :manual_ack option and 
  # send a proper acknowledgment from the worker, once we're done with a task.
            
  q.subscribe(:manual_ack => true, :block => true) do |delivery_info, properties, body|
    puts " [x] Received '#{body}'"
    # imitate some work
    sleep body.count(".").to_i
    puts " [x] Done"
        
    # In order to make sure a message is never lost, RabbitMQ supports message acknowledgments. An ack(nowledgement) is 
    # sent back from the consumer to tell RabbitMQ that a particular message has been received, processed 
    # and that RabbitMQ is free to delete it.
    # 
    # If a consumer dies without sending an ack, RabbitMQ will understand that a message wasn't processed fully and will 
    # redeliver it to another consumer. That way you can be sure that no message is lost, even if the workers 
    # occasionally die.
    # 
    # Using this code we can be sure that even if you kill a worker using CTRL+C while it was processing a message, 
    # nothing will be lost. Soon after the worker dies all unacknowledged messages will be redelivered.
                
        
    ch.ack(delivery_info.delivery_tag)
  end
rescue Interrupt => _
  conn.close
end