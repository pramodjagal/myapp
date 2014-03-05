require 'test_helper'

class AngularControllerTest < ActionController::TestCase
  test "should get albums" do
    get :albums
    assert_response :success
  end

end
