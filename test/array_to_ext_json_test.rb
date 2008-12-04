require File.dirname(__FILE__) + '/test_helper'

class ArrayToExtJsonTest < Test::Unit::TestCase
  def test_to_ext_json_should_be_defined
    assert Array.new.respond_to?(:to_ext_json)
  end
end
