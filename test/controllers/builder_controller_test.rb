require 'test_helper'

class BuilderControllerTest < ActionController::TestCase
  test "should get albums" do
    get :albums
    assert_response :success
  end

end
