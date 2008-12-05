require File.dirname(__FILE__) + '/test_helper'

class ProclaimedKlazz; end

class ArrayToExtJsonTest < Test::Unit::TestCase
  def test_to_ext_json_should_be_defined
    assert Array.new.respond_to?(:to_ext_json)
  end

  def test_generate_ext_json_with_derived_class
    data = [ [1], [2] ]
    assert_equal({'results' => data.size, 'arrays' => data}, ActiveSupport::JSON::decode(data.to_ext_json))
  end
  
  def test_generate_ext_json_with_given_class
    data = [ [1], [2] ]
    assert_equal({'results' => data.size, 'proclaimed_klazzs' => data}, ActiveSupport::JSON::decode(data.to_ext_json(:class => 'proclaimed_klazz')))
  end

  def test_generate_ext_json_with_given_count
    data = [ [1], [2] ]
    assert_equal({'results' => 5, 'arrays' => data}, ActiveSupport::JSON::decode(data.to_ext_json(:count => 5)))
  end

end
