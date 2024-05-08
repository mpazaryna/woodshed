def dr_chams_timeline( year )
  case year
  when 1894
    "born"
  when 1895..1913
    "living in aruba"
  end
end

puts dr_chams_timeline( 1897 )