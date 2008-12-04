require File.dirname(__FILE__) + '/test_helper'

class StubModel < ActiveRecord::Base
  def self.columns # make AR happy even without existing DB table
    @columns ||= []
  end
end

class ActiveRecordToExtJsonTest < Test::Unit::TestCase
  def test_to_ext_json_should_be_defined
    assert StubModel.new.respond_to?(:to_ext_json)
  end
end
