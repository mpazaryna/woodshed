require 'spec_helper'

describe Person do
  before(:each) do
    @person = Person.new
    @name = "test1"
    @age = 22
  end

  it "can be instantiated" do
    Person.new.should be_an_instance_of(Person)
  end

  it "can be saved successfully" do
    Person.create.should be_persisted
  end
end