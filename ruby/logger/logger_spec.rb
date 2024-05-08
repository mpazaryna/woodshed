require 'logger'

class Hello
   attr_accessor :config
   def initialize opts = {}
      self.config = {
        name:   "Foobar",
        type:   :gadget,
        serial: "abc123"
      }.merge opts
      logger.debug "App initialized with config: #{self.config}"
    end

  def greet
    log = Logger.new(STDOUT)
    log.level = Logger::DEBUG
    log.debug("executing greet")
    "Hello, World!"
  end
end

describe "Greeter" do
 it "should say 'Hello, World!' when it receives the greet() message" do
  greeter = Hello.new
  greeting = greeter.greet
  greeting.should == "Hello, World!"
 end
end
