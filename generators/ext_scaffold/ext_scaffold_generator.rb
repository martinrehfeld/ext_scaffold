class ExtScaffoldGenerator < Rails::Generator::NamedBase

  default_options :skip_timestamps => false, :skip_migration => false

  attr_reader   :controller_name,
                :controller_class_path,
                :controller_file_path,
                :controller_class_nesting,
                :controller_class_nesting_depth,
                :controller_class_name,
                :controller_underscore_name,
                :controller_singular_name,
                :controller_plural_name
  alias_method  :controller_file_name,  :controller_underscore_name
  alias_method  :controller_table_name, :controller_plural_name

  def initialize(runtime_args, runtime_options = {})
    super

    @rspec = has_rspec?
    
    @controller_name = @name.pluralize

    base_name, @controller_class_path, @controller_file_path, @controller_class_nesting, @controller_class_nesting_depth = extract_modules(@controller_name)
    @controller_class_name_without_nesting, @controller_underscore_name, @controller_plural_name = inflect_names(base_name)
    @controller_singular_name=base_name.singularize
    if @controller_class_nesting.empty?
      @controller_class_name = @controller_class_name_without_nesting
    else
      @controller_class_name = "#{@controller_class_nesting}::#{@controller_class_name_without_nesting}"
    end
  end

  def manifest
    record do |m|
      # Check for class naming collisions.
      m.class_collisions(controller_class_path, "#{controller_class_name}Controller", "#{controller_class_name}Helper")
      m.class_collisions(class_path, "#{class_name}")

      # Controller, helper, views, and test directories.
      m.directory(File.join('app/models', class_path))
      m.directory(File.join('app/controllers', controller_class_path))
      m.directory(File.join('app/helpers', controller_class_path))
      m.directory(File.join('app/views', controller_class_path, controller_file_name))
      m.directory(File.join('app/views/layouts', controller_class_path))
      m.directory('public/images/ext_scaffold')
      m.directory(File.join('public/javascripts/ext_scaffold', "#{controller_class_path}"))

      if @rspec
        m.directory(File.join('spec/controllers', controller_class_path))
        m.directory(File.join('spec/helpers', class_path))
        m.directory(File.join('spec/models', class_path))
        m.directory File.join('spec/views', controller_class_path, controller_file_name)
        m.directory(File.join('spec/fixtures', class_path))
      else
        m.directory(File.join('test/functional', controller_class_path))
        m.directory(File.join('test/unit', class_path))
      end
            
      # index view
      m.template('view_index.html.erb', File.join('app/views', controller_class_path, controller_file_name, 'index.html.erb'))
      
      # ext component for scaffold
      m.template('ext_scaffold_panel.js', File.join('public/javascripts/ext_scaffold', controller_class_path, "#{class_name.demodulize.underscore}.js"))

      # layout
      m.template('layout.html.erb', File.join('app/views/layouts', controller_class_path, "#{controller_file_name}.html.erb"))
      
      # model --> use model generator
      m.dependency 'model', [name] + @args, :collision => :skip

      # controller
      m.template('controller.rb', File.join('app/controllers', controller_class_path, "#{controller_file_name}_controller.rb"))
      m.template('helper.rb',          File.join('app/helpers',     controller_class_path, "#{controller_file_name}_helper.rb"))

      # assets
      m.template('assets/javascripts/ext_scaffold.js', 'public/javascripts/ext_scaffold.js')
      m.template('assets/images/arrowLeft.gif', 'public/images/ext_scaffold/arrowLeft.gif')
      m.template('assets/images/arrowRight.gif', 'public/images/ext_scaffold/arrowRight.gif')
      m.template('assets/images/find.png', 'public/images/ext_scaffold/find.png')
      m.template('assets/stylesheets/ext_scaffold.css', 'public/stylesheets/ext_scaffold.css')

      # tests
      if @rspec
        m.template('rspec/functional_spec.rb', File.join('spec/controllers', controller_class_path, "#{controller_file_name}_controller_spec.rb"))
        m.template('rspec/routing_spec.rb', File.join('spec/controllers', controller_class_path, "#{controller_file_name}_routing_spec.rb"))
        m.template('rspec/helper_spec.rb', File.join('spec/helpers', class_path, "#{controller_file_name}_helper_spec.rb"))
        m.template('rspec/unit_spec.rb', File.join('spec/models', class_path, "#{file_name}_spec.rb"))
      else
        m.template('functional_test.rb', File.join('test/functional', controller_class_path, "#{controller_file_name}_controller_test.rb"))
      end

      m.route_resources controller_file_name
    end
  end

  # Lifted from Rick Olson's restful_authentication
  def has_rspec?
    options[:rspec] || (File.exist?('spec') && File.directory?('spec'))
  end
  
  protected
    # Override with your own usage banner.
    def banner
      "Usage: #{$0} ext_scaffold ModelName [field:type, field:type]"
    end
    
    def rspec_views
      %w[ index show ]
    end    

    def add_options!(opt)
      opt.separator ''
      opt.separator 'Options:'
      opt.on("--skip-timestamps",
             "Don't add timestamps to the migration file for this model") { |v| options[:skip_timestamps] = v }
      opt.on("--skip-migration",
             "Don't generate a migration file for this model") { |v| options[:skip_migration] = v }
      opt.on("--rspec", 
             "Force rspec mode (checks for RAILS_ROOT/spec by default)") { |v| options[:rspec] = true }
    end

    def model_name
      class_name.demodulize
    end
end
