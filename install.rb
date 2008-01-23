# Copy custom assets
puts "\nInstalling Assets"
for path in [ ['javascripts', 'ext_datetime.js'],
              ['stylesheets', 'ext_scaffold.css'],
              ['images', 'ext_scaffold', 'arrowRight.gif'],
              ['images', 'ext_scaffold', 'arrowLeft.gif'] ]
  source = File.join(File.dirname(__FILE__),'assets',*path)
  destination = File.join(RAILS_ROOT,'public',*path)
  print "  #{path.join('/')} "
  if File.exists?(destination)
    if FileUtils.cmp(source, destination)
      puts "identical"
    else
      print "exits, overwrite [yN]?"
      if gets("\n").chomp.downcase.first == 'y'
        FileUtils.cp source, destination
      else
        puts "    ...skipped"; next
      end
    end
  else
    puts "create"
    FileUtils.cp source, destination
  end
end

puts <<_MSG

You now need to download the Ext Javascript framework from

http://extjs.com/download

and unzip it into "#{RAILS_ROOT}/public/ext" if you have not done so yet.
Ext_scaffold was tested against version 2.0 of the Ext framework, available via

http://extjs.com/deploy/ext-2.0.zip

_MSG
