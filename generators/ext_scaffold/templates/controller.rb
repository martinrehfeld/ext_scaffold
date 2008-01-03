class <%= controller_class_name %>Controller < ApplicationController

  before_filter :find_<%= file_name %>, :only => [ :show, :edit, :update, :destroy ]

  # GET /<%= table_name %>
  # GET /<%= table_name %>.ext_json
  def index
    respond_to do |format|
      format.html     # index.html.erb (no data required)
      format.ext_json { render :json => find_<%= table_name %>.to_ext_json(:class => :<%= file_name %>, :count => <%= class_name %>.count) }
    end
  end

  # GET /<%= table_name %>/1
  def show
    # show.html.erb
  end

  # GET /<%= table_name %>/new
  def new
    # new.html.erb (no data required)
  end

  # GET /<%= table_name %>/1/edit
  def edit
    # edit.html.erb
  end

  # POST /<%= table_name %>
  def create
    @<%= file_name %> = <%= class_name %>.new(params[:<%= file_name %>])

    respond_to do |format|
      if @<%= file_name %>.save
        flash[:notice] = '<%= class_name %> was successfully created.' # TODO: how to handle flash apropriately
        format.ext_json { render(:update) {|page| page.redirect_to <%= table_name %>_url } }
      else
        format.ext_json { render :json => extjs_errors }
      end
    end
  end

  # PUT /<%= table_name %>/1
  def update
    respond_to do |format|
      if @<%= file_name %>.update_attributes(params[:@<%= file_name %>])
        flash[:notice] = '<%= class_name %> was successfully updated.' # TODO: how to handle flash apropriately
        format.ext_json { render(:update) {|page| page.redirect_to <%= table_name %>_url } }
      else
        format.ext_json { render :json => extjs_errors }
      end
    end
  end

  # DELETE /<%= table_name %>/1
  def destroy
    @<%= file_name %>.destroy # TODO: handle errors

    respond_to do |format|
      format.js  { head :ok }
    end
  end
  
  protected
  
    def find_<%= file_name %>
      @<%= file_name %> = <%= class_name %>.find(params[:id])
    end
    
    def find_<%= table_name %>
      sort_field = (params[:sort] || session[:<%= table_name %>_sort_field] || 'id').sub(/(\A[^\[]*)\[([^\]]*)\]/,'\2') # fields may be passed as "object[attr]"
      sort_direction = (params[:dir] || session[:<%= table_name %>_sort_direction]).to_s.upcase
      offset = (params[:start] || session[:<%= table_name %>_offset] || 0).to_i
      limit = (params[:limit] || session[:<%= table_name %>_limit] || 9223372036854775807).to_i
      # allow only valid sort_fields matching column names of this model ...
      sort_field, sort_direction = nil, nil unless <%= class_name %>.column_names.include?(sort_field)
      # ... and valid sort_directions
      sort_direction = nil unless %w(ASC DESC).include?(sort_direction)

      # save pagination information in session
      session[:<%= table_name %>_sort_field] = sort_field
      session[:<%= table_name %>_sort_direction] = sort_direction
      session[:<%= table_name %>_offset] = offset
      session[:<%= table_name %>_limit] = limit

      @<%= table_name %> = <%= class_name %>.find(:all, :offset => offset, :limit => limit, :order => "#{sort_field} #{sort_direction}")
    end
  
    def extjs_errors
      error_hash = {}
      @<%= file_name %>.attributes.each do |field, value|
        if errors = @<%= file_name %>.errors.on(field)
          error_hash["@<%= file_name %>[#{field}]"] = "#{errors.is_a?(Array) ? errors.first : errors}"
        end
      end
      { :success => false, :errors => error_hash }
    end

end
