class SimulateController < ApplicationController
  def failure
    raise "Faux Exception from the controller"
  end
end
