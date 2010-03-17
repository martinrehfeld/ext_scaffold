class <%= controller_class_name %>Controller < ApplicationController
  
  include ExtScaffold

  rescue_from ActiveRecord::RecordNotFound do |exception|
    render :json => { :success => false }, :status => :not_found
  end
  before_filter :find_<%= controller_class_name.demodulize.tableize %>, :only => [ :index ]
  before_filter :find_<%= file_name %>, :only => [ :update, :destroy ]

  # GET /<%= controller_class_name.tableize %>
  # GET /<%= controller_class_name.tableize %>.ext_json
  def index
    respond_to do |format|
      format.html     # index.html.erb (no data required)
      format.ext_json { render :json => @<%= controller_class_name.demodulize.tableize %>.to_ext_json(:class => <%= class_name %>, :count => <%= class_name %>.count(options_from_search(<%= class_name %>))) }
    end
  end

  # POST /<%= controller_class_name.tableize %>
  def create
    @<%= file_name %> = <%= class_name %>.new(params[:<%= file_name %>])
    render :json => @<%= file_name %>.to_ext_json(:success => @<%= file_name %>.save)
  end

  # PUT /<%= controller_class_name.tableize %>/1
  def update
    render :json => @<%= file_name %>.to_ext_json(:success => @<%= file_name %>.update_attributes(params[:<%= file_name %>]))
  end

  # DELETE /<%= controller_class_name.tableize %>/1
  def destroy
    @<%= file_name %>.destroy
    head :ok
  end
  
protected
  
  def find_<%= file_name %>
    @<%= file_name %> = <%= class_name %>.find(params[:id])
  end
  
  def find_<%= controller_class_name.demodulize.tableize %>
    @<%= controller_class_name.demodulize.tableize %> = <%= class_name %>.find(:all, pagination_state.merge(options_from_search(<%= class_name %>)))
  end

end
