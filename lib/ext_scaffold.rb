module ExtScaffold

protected

  def pagination_state
    {}.merge(:offset=>params.delete(:start)).merge(:limit=>params.delete(:limit))
  end

  def options_from_search(restraining_model = nil)
    model_klass = (restraining_model.is_a?(Class) || restraining_model.nil? ? restraining_model : restraining_model.to_s.classify.constantize)
    returning options = {} do
      search_conditions = []
      unless [params[:fields], params[:query]].any?(&:blank?)
        ActiveSupport::JSON::decode(params[:fields]).each do |field|
          field.sub!(/(\A[^\[]*)\[([^\]]*)\]/,'\2') # fields may be passed as "object[attr]"
          next unless model_klass.nil? || model_klass.column_names.include?(field) # accept only valid column names
          search_conditions << "#{field} LIKE :query"
        end
      end
      
      options.merge!(:conditions => [search_conditions.join(' OR '),
                    {:query      => "%#{params[:query]}%"}]
                    ) unless search_conditions.empty?
    end
  end

private

end