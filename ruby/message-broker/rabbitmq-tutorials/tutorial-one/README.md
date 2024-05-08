http://www.rabbitmq.com/tutorials/tutorial-one-ruby.html

RabbitMQ is a message broker. The principal idea is pretty simple: it accepts and forwards messages. You can think about it as a post office: when you send mail to the post box 
you're pretty sure that Mr. Postman will eventually deliver the mail to your recipient. Using this metaphor RabbitMQ is a post box, a post office and a postman.

The major difference between RabbitMQ and the post office is the fact that it doesn't deal with paper, instead it accepts, stores and forwards 
binary blobs of data ‒ messages.

Producing means nothing more than sending. A program that sends messages is a producer. 

A queue is the name for a mailbox. It lives inside RabbitMQ. Although messages flow through RabbitMQ and your applications, they can be stored only inside a queue. 
A queue is not bound by any limits, it can store as many messages as you like ‒ it's essentially an infinite buffer. Many producers can send messages that go to one 
queue, many consumers can try to receive data from one queue. A queue will be drawn as like that, with its name above it:

Consuming has a similar meaning to receiving. A consumer is a program that mostly waits to receive messages.

RabbitMQ speaks AMQP 0.9.1, which is an open, general-purpose protocol for messaging. There are a number of clients for RabbitMQ in many different 
languages. We'll use the Bunny client in this tutorial.



