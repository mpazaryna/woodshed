# Simple exercise class to test various File functions for the gathering lists of 
# file system based static reports
class FileThing

  def search_param(x)
    case x
      when "pdf"
        "*.pdf"
      when "txt"
        "*.txt"
      when "csv"
        "*.csv"
      when "fo"
        "*.fo"  
      else
        "*.*"  
    end
  end
  
  def strip_param(x)
    case x
      when "pdf"
        ".pdf"
      when "txt"
        ".txt"
      when "csv"
        ".csv"
      else
        ".*"  
    end
  end
  
  def get_array(full_path,search_for)
    Dir.chdir(full_path)
    arr = Dir.glob(search_for)
  end
  
  def get_hash(full_path,search_for)
    Dir.chdir(full_path)
    dat = Dir.glob(search_for)
    h = Hash[*(dat.collect{|v| [v,v]}.flatten)] 
  end  
  
  def strip_file_type(arr, strip_me)
    new_arr = []
    arr.each do |a| 
      s = File.basename(a, strip_me)
      new_arr << s
    end
    new_arr
  end  
  
  def strip_file_prefix(arr, strip_me)
    new_arr = []
    arr.each do |a| 
      t = a.sub!(%r{^#{strip_me}},"")
      new_arr << t
    end
    new_arr
  end  
  
  def get_report_type(arr)
    new_arr = []
    arr.each do |a| 
      puts a
      if a.scan(/power-/)
        new_arr << "power"
      else
        new_arr << "not found"
      end  
    end
    new_arr
  end  
end

describe FileThing, "#read" do
  before(:each) do
    @FileThing = FileThing.new
    @base = "/Users/matt.pazaryna/work/hills/ruby/files/dat/power/reports"
    @company_guid = "3c51918e-662b-447c-899a-ad0249aa2586"
    @full_path = @base + "/" + @company_guid + "/" 
  end
  it "should return HASH of files for a specific file type pattern - PDF" do
    search_for = @FileThing.search_param("pdf")
    files = @FileThing.get_hash(@full_path, search_for)
    files.should == {"power-2012-01.pdf"=>"power-2012-01.pdf", "power-2012-02.pdf"=>"power-2012-02.pdf"}
  end
  it "should return ARRAY of files for specific file type pattern - PDF" do
    search_for = @FileThing.search_param("pdf")
    files = @FileThing.get_array(@full_path, search_for)
    files.should == ["power-2012-01.pdf","power-2012-02.pdf"]
  end
  it "should return ARRAY of files for specific file type pattern - FO" do
    search_for = @FileThing.search_param("fo")
    files = @FileThing.get_array(@full_path, search_for)
    files.should == ["power-2012-01.fo"]
  end
  it "should return an array of files for a wildcard pattern" do
    search_for = @FileThing.search_param("all")
    files = @FileThing.get_array(@full_path, search_for)
    files.should == ["power-2012-01.fo","power-2012-01.pdf","power-2012-01.txt","power-2012-02.pdf","power-2012-02.txt"]
  end
  it "should return an array of file basenames for a specific pattern" do
    search_for = @FileThing.search_param("pdf")
    files = @FileThing.get_array(@full_path, search_for)
    strip_for = @FileThing.strip_param("pdf")
    z = @FileThing.strip_file_type(files, strip_for)
    z.should == ["power-2012-01","power-2012-02"]
  end
  it "should return an array of file basenames for a specific pattern without the prefix" do
    search_for = @FileThing.search_param("pdf")
    files = @FileThing.get_array(@full_path, search_for)
    strip_for = @FileThing.strip_param("pdf")
    z = @FileThing.strip_file_type(files, strip_for)
    z.should == ["power-2012-01","power-2012-02"]
    y = @FileThing.strip_file_prefix(z, "power-")
    y.should == ["2012-01","2012-02"]
  end
end