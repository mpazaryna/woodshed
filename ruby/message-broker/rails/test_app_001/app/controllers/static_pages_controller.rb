class StaticPagesController < ApplicationController

  def home
    flash[:notice] = "Just a simple flash notification."    
    redirect_to about_path
  end

  def help
  end
      
  def about
  end
      
end