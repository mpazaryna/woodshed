class ApplicationController < ActionController::Base
  protect_from_forgery 
    
  def log_it
    Rails.logger.info "REQUEST INSPECTOR"
      Rails.logger.info "  [REQUEST_URI] #{request.headers['REQUEST_URI'].inspect}"
      Rails.logger.info "  [RAW_POST]: #{request.raw_post.inspect}"
      Rails.logger.info "  [DOMAIN]: #{request.domain.to_s}"
      Rails.logger.info "  [HOST]: #{request.host}"
      Rails.logger.info "  [FORMAT]: #{request.format.inspect}"
      Rails.logger.info "  [PARAMS]: #{request.params.inspect}"
      Rails.logger.info "  [PROTOCOL]: #{request.protocol.inspect}"
      Rails.logger.info "  [REMOTE_IP]: #{request.remote_ip.inspect}"
      Rails.logger.info "  [QUERY_STRING]: #{request.query_string.inspect}"
      Rails.logger.info "  [URL]: #{request.url.inspect}"
      Rails.logger.info "  [PORT]: #{request.port.inspect}"
      Rails.logger.info "  [METHOD]: #{request.method.inspect}"
      Rails.logger.info "  [HTTP_AUTHORIZATION] #{request.headers['HTTP_AUTHORIZATION'].inspect}"
      Rails.logger.info "  [CONTENT_TYPE]: #{request.headers['CONTENT_TYPE'].inspect}" 
      Rails.logger.info "  [HTTP_ACCEPT] #{request.headers['HTTP_ACCEPT'].inspect}"
      Rails.logger.info "  [HTTP_HOST] #{request.headers['HTTP_HOST'].inspect}"
      Rails.logger.info "  [HTTP_USER_AGENT] #{request.headers['HTTP_USER_AGENT'].inspect}"    
      Rails.logger.info "  [BODY] #{request.body.string}"
  end
  
end