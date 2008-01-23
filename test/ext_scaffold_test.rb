require 'test/unit'
require 'fileutils'

# This is more or less what I would refer to as an integration test. It tests
# the complete process from project creation to running the generated functional
# tests.
class ExtScaffoldTest < Test::Unit::TestCase

  def test_project_creation_and_demo_scaffold
    # generate demo Rails project
    `rails ext_scaffold_demo --force --database=sqlite3`
    assert_equal 0, $?

    # install ext_scaffold plugin
    FileUtils.mkdir_p './ext_scaffold_demo/vendor/plugins/ext_scaffold'
    FileUtils.cp_r %w(init.rb install.rb uninstall.rb ./assets ./generators ./lib ./tasks), './ext_scaffold_demo/vendor/plugins/ext_scaffold'
    `cd ext_scaffold_demo/vendor/plugins/ext_scaffold; ruby ../../../script/runner ./install.rb`
    assert_equal 0, $?

    # generate sample scaffold
    `cd ext_scaffold_demo; ruby script/generate ext_scaffold Post title:string body:text published:boolean visible_from:datetime visible_to:date`
    assert_equal 0, $?

    # migrate DB
    `cd ext_scaffold_demo; rake db:migrate`
    assert_equal 0, $?
    
    # run functional tests on generated scaffold
    `cd ext_scaffold_demo; rake`
    assert_equal 0, $?

  ensure
    FileUtils.rm_r './ext_scaffold_demo'
  end

end
