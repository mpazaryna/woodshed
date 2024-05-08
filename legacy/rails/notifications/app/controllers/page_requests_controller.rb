class PageRequestsController < ApplicationController
  # GET /page_requests
  # GET /page_requests.json
  
  def index
    @page_requests = PageRequest.find(:all, :order => 'created_at')

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @page_requests }
    end
  end

  # GET /page_requests/1
  # GET /page_requests/1.json
  def show
    @page_request = PageRequest.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @page_request }
    end
  end

end
