require 'test/unit'
require 'rubygems'
require 'activesupport'
require 'active_record'
require 'action_controller'
require 'action_controller/test_case'
require 'action_controller/test_process'

RAILS_ENV = 'test'

# setup Rails' autoloading
ActiveSupport::Dependencies.load_paths << File.expand_path(File.dirname(__FILE__) + "/../lib/")
$LOAD_PATH.unshift(File.expand_path(File.dirname(__FILE__) + "/../lib/"))

RAILS_DEFAULT_LOGGER = ActiveRecord::Base.logger = Logger.new(File.dirname(__FILE__) + "/test.log")

# install default routes
ActionController::Routing::Routes.draw do |map|
  map.connect ':controller/:action/:id'
  map.connect ':controller/:action/:id.:format'
end

# initialize the ext_scaffold plugin
require File.dirname(__FILE__) + '/../init'
