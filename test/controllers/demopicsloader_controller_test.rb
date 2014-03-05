require 'test_helper'

class DemopicsloaderControllerTest < ActionController::TestCase
  test "should get albums" do
    get :albums
    assert_response :success
  end

end
