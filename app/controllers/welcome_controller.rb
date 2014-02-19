class WelcomeController < ApplicationController
  def index

  end

  def sayhello
    render text: "Hello "+params[:details][:name]
  end



  def details_param
    params.require(:details).permit(:test)
  end
end
