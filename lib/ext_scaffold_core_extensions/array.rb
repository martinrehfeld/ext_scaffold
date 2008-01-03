module ExtScaffoldCoreExtensions
  module Array

    def to_ext_json(options = {})
      if options[:class]
        element_class = (options[:class].is_a?(Class) ? options[:class] : options[:class].to_s.classify.constantize)
      else
        element_class = first.class
      end
      element_count = options[:count] || self.length

      { :results => element_count, element_class.to_s.underscore.pluralize => self }.to_json
    end

  end
end
