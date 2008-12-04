require File.dirname(__FILE__) + '/test_helper'

class StubController < ActionController::Base
  include ::ExtScaffold

  def pagination
    @pagination_state = update_pagination_state_with_params!
    @options_from_pagination_state = options_from_pagination_state(@pagination_state)
    head :ok
  end
  
  def search
    @options_from_search = options_from_search
    head :ok
  end
end

class StubControllerTest < ActionController::TestCase

  def test_pagination_state_should_be_stored_in_session
    get :pagination
    assert_response :success
    assert_equal assigns(:pagination_state), session['_pagination_state']
  end

  def test_pagination_options_should_be_converted
    get :pagination, { :sort => 'sortfield', :dir => 'DESC', :start => 123, :limit => 456 }
    assert_response :success
    assert_equal({:order => "sortfield DESC", :offset => 123, :limit => 456}, assigns(:options_from_pagination_state))
  end
  
  def test_pagination_options_should_be_restored_from_session
    get :pagination, { :sort => 'somefield', :dir => 'DESC', :start => 456, :limit => 789 }
    assert_response :success
    get :pagination # no params!
    assert_response :success
    assert_equal({:order => "somefield DESC", :offset => 456, :limit => 789}, assigns(:options_from_pagination_state))
    get :pagination, { :dir => 'ASC' }
    assert_response :success # override only sort direction
    assert_equal({:order => "somefield ASC", :offset => 456, :limit => 789}, assigns(:options_from_pagination_state))
  end
  
  def test_search_options_should_be_converted
    get :search, { :fields => '["model[field1]","model[field2]"]', :query => 'searchterm' }
    assert_response :success
    assert_equal({:conditions=>["field1 LIKE :query OR field2 LIKE :query", {:query=>"%searchterm%"}]}, assigns(:options_from_search))
  end

end