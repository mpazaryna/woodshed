require_relative 'test_helper'
require './lib/email_util'

class EmailUtilTest < MiniTest::Test
  context 'a email util' do
      
  should 'exist' do
    u = EmailUtil.new
    assert_kind_of EmailUtil, u
  end
   
  should 'return domain' do
    u = EmailUtil.new
    assert_equal "example.com", u.return_domain("mpazaryna@example.com")    
  end

  should 'replace domain' do
    u = EmailUtil.new
    assert_equal "matt.pazaryna@sungardas.com", u.replace_domain("matt.pazaryna@sungard.com")    
  end
      
  should 'validate domain' do
    u = EmailUtil.new
    assert_equal true, u.validate_email_domain("matt.pazaryna@sungardas.com")    
  end   
       
 end      
end