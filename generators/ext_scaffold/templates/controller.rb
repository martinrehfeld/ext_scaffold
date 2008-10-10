class <%= controller_class_name %>Controller < ApplicationController
  
  include ExtScaffold

  rescue_from ActiveRecord::RecordNotFound do |exception|
    render :json => { :success => false }, :status => :not_found
  end
  before_filter :find_<%= file_name %>, :only => [ :update, :destroy ]

  # GET /<%= table_name %>
  # GET /<%= table_name %>.ext_json
  def index
    respond_to do |format|
      format.html     # index.html.erb (no data required)
      format.ext_json { render :json => find_<%= table_name %>.to_ext_json(:class => <%= class_name %>, :count => <%= class_name %>.count(options_from_search(<%= class_name %>))) }
    end
  end

  # POST /<%= table_name %>
  def create
    @<%= file_name %> = <%= class_name %>.new(params[:<%= file_name %>])
    render :json => @<%= file_name %>.to_ext_json(:success => @<%= file_name %>.save)
  end
  

  # PUT /<%= table_name %>/1.ext_json
  def update
    render :json => @<%= file_name %>.to_ext_json(:success => @<%= file_name %>.update_attributes(params[:<%= file_name %>]))
  end

  # DELETE /<%= table_name %>/1
  def destroy
    @<%= file_name %>.destroy
    head :ok
  end
  
protected
  
  def find_<%= file_name %>
    @<%= file_name %> = <%= class_name %>.find(params[:id])
  end
  
  def find_<%= table_name %>
    pagination_state = update_pagination_state_with_params!(<%= class_name %>)
    @<%= table_name %> = <%= class_name %>.find(:all, options_from_pagination_state(pagination_state).merge(options_from_search(<%= class_name %>)))
  end

end
