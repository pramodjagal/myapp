Myapp::Application.routes.draw do
  get "albumsloader/index"
  get "demopicsloader/index"
  get "angulartest/index"
  get "welcome/index"
  post "welcome/sayhello"
  root to: "welcome#index"
  resources :details

end
