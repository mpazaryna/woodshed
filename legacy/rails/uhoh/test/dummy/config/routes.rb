Rails.application.routes.draw do
  get "simulate/failure"
  mount Uhoh::Engine => "/uhoh"
  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => 'welcome#index'
end
