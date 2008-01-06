module ExtScaffoldCoreExtensions
  module ActiveRecord
    module Base

      def to_ext_json(options = {})
        # always transform attribute hash keys to model_name[attribute_name]
        if options.delete(:output_format) == :form_values
          # return array of id/value hashes for setValues
          attributes.map{|name,value| { :id => "#{self.class.to_s.underscore}[#{name}]", :value => value } }.to_json(options)
        else
          # return sucess/data hash from form loader
          { :success => true, :data => Hash[*attributes.map{|name,value| ["#{self.class.to_s.underscore}[#{name}]", value] }.flatten] }.to_json(options)
        end
      end

    end
  end
end
