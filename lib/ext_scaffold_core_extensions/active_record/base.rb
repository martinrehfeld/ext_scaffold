module ExtScaffoldCoreExtensions
  module ActiveRecord
    module Base

      def to_ext_json(options = {})
        if options.delete(:success) || (success.nil? && valid?)
          # return sucess/data hash to form loader, i.e.:
          #  {"data": { "post[id]": 1, "post[title]": "First Post",
          #             "post[body]": "This is my first post.",
          #             "post[published]": true, ...},
          #   "success": true}
          { :success => true, :data => Hash[*attributes.map{|name,value| ["#{self.class.to_s.demodulize.underscore}[#{name}]", value] }.flatten] }.to_json(options)
        else
          # return no-sucess/errors hash to form submitter, i.e.:
          #  {"errors":  { "post[title]": "Title can't be blank", ... },
          #   "success": false }
          error_hash = errors.inject({}) do |result, error| # error is [attribute, message]
            field_key = "#{self.class.to_s.demodulize.underscore}[#{error.first}]"
            result[field_key] ||= 'Field ' + Array(errors[error.first]).join(' and ')
            result
          end
          { :success => false, :errors => error_hash }.to_json(options)
        end
      end

    end
  end
end
