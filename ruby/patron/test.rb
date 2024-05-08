require 'patron'
sess = Patron::Session.new
sess.timeout = 10
sess.base_url = 'http://135.16.233.13:3070'
resp = sess.get("/users/1.xml")
if resp.status < 400
  puts resp.body
end



