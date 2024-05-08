Rails.application.routes.draw do
  get 'home/index'

  root 'static_pages#home'
  get  'static_pages/help'
  get '/about', to: 'static_pages#about', as: 'about'    
end