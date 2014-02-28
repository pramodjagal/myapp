require 'test_helper'

class DemopicsloaderControllerTest < ActionController::TestCase
  test "should get index" do
    get :index
    assert_response :success
  end

end
