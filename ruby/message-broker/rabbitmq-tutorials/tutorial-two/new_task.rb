#!/usr/bin/env ruby
# encoding: utf-8

require "bunny"

conn = Bunny.new(:automatically_recover => false)
conn.start

# At this point we're sure that the task_queue queue won't be lost even if RabbitMQ restarts. Now we need to mark our messages as 
# persistent - by using the :persistent option Bunny::Exchange#publish takes.

ch   = conn.create_channel
q    = ch.queue("task_queue", :durable => true)
msg  = ARGV.empty? ? "Hello World!" : ARGV.join(" ")

# Note on message persistence
# 
# Marking messages as persistent doesn't fully guarantee that a message won't be lost. Although it tells RabbitMQ 
# to save the message to disk, there is still a short time window when RabbitMQ has accepted a message and hasn't saved it 
# yet. Also, RabbitMQ doesn't do fsync(2) for every message -- it may be just saved to cache and not really written 
# to the disk. The persistence guarantees aren't strong, but it's more than enough for our simple task queue. 
# If you need a stronger guarantee then you can use publisher confirms.
            
q.publish(msg, :persistent => true)
puts " [x] Sent #{msg}"

conn.close