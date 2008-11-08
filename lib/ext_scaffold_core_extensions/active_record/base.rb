module ExtScaffoldCoreExtensions
  module ActiveRecord
    module Base

      def to_ext_json(options = {})
        success = options.delete(:success)
        methods = Array(options.delete(:methods))
        underscored_class_name = self.class.to_s.demodulize.underscore

        if success || (success.nil? && valid?)
          # return success/data hash to form loader, i.e.:
          #  {"data": { "post[id]": 1, "post[title]": "First Post",
          #             "post[body]": "This is my first post.",
          #             "post[published]": true, ...},
          #   "success": true}
          data =  attributes.map{|name,value| ["#{underscored_class_name}[#{name}]", value] }
          methods.each do |method|
            data << ["#{underscored_class_name}[#{method}]", self.send(method)] if self.respond_to? method
          end
          { :success => true, :data => Hash[*data.flatten] }.to_json(options)
        else
          # return no-success/errors hash to form submitter, i.e.:
          #  {"errors":  { "post[title]": "Title can't be blank", ... },
          #   "success": false }
          error_hash = errors.inject({}) do |result, error| # error is [attribute, message]
            field_key = "#{underscored_class_name}[#{error.first}]"
            result[field_key] ||= 'Field ' + Array(errors[error.first]).join(' and ')
            result
          end
          { :success => false, :errors => error_hash }.to_json(options)
        end
      end

    end
  end
end
