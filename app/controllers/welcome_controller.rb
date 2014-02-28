require 'action_view/vendor/html-scanner/html/sanitizer'

class WelcomeController < ApplicationController
  def index

  end

  def sayhello
    render text: "Hello "+ActionController::Base.helpers.sanitize(params[:details][:name])
  end



end
