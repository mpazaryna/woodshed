hills-message-broker
====================

======= git flow feature rails-app ================

Switched to a new branch 'feature/rails-app'                                                                                                                                                                
                                                                                                                                                                                                            
Summary of actions:                                                                                                                                                                                         
- A new branch 'feature/rails-app' was created, based on 'develop'                                                                                                                                          
- You are now on branch 'feature/rails-app'                                                                                                                                                                 
                                                                                                                                                                                                            
Now, start committing on your feature. When done, use:                                                                                                                                                      
                                                                                                                                                                                                            
     git flow feature finish rails-app                                                                                                                                                                      
                                                                                                                            
Install log for: rabbitmq

=> Downloading http://parts.codio.com/box-codio-v1/erlang-17.0-binary.tar.gz...
=> Extracting archive...
=> Installing...
=> Activating...
=> Installed erlang 17.0
=> Downloading http://parts.codio.com/box-codio-v1/rabbitmq-3.2.3-binary.tar.gz...
=> Extracting archive...
=> Installing...
=> Activating...
=> Installed rabbitmq 3.2.3

============ rabbitmq ============
To start the Rabbitmq server:
  $ parts start rabbitmq

To stop the Rabbitmq server:
  $ parts stop rabbitmq

Rabbitmq config is located at:
  $ /home/codio/.parts/etc/rabbitmq/