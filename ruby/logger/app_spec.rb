require File.expand_path(File.dirname(__FILE__) + '/spec_helper')

describe Example::App do
  before(:each) do
    @app = Example::App.new
  end

  it "should log to info on run start and end" do
    Example.logger.level = Logger::INFO

    @app.run
    log.should include("Run started")
    log.should include("Run completed")
  end

  it "should log to debug on the cleanup step" do
    Example.logger.level = Logger::DEBUG

    @app.run
    log.should include("Cleaning up...")
  end

  it "should log an error if ran on a :widget" do
    Example.logger.level = Logger::ERROR

    @app.config[:type] = :widget
    @app.run
    
    log.should include("Widgets can't perform this action!")
  end
end