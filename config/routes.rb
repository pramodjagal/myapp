Myapp::Application.routes.draw do
  get "welcome/index"
  post "welcome/sayhello"
  root to: "welcome#index"
  resources :details

end
