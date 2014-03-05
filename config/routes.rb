Myapp::Application.routes.draw do
  get "preview/index"
  get "builder/index"
  root to: "builder#index"
end
