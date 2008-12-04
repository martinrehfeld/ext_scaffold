ENV["RAILS_ENV"] = "test"
require File.expand_path(File.dirname(__FILE__) + "/../../../../config/environment")
require 'action_controller/test_case'
require 'action_controller/test_process'

# initialize this ext_scaffold plugin
require File.dirname(__FILE__) + '/../init'
