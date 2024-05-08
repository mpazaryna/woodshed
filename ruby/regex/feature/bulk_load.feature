Feature: Bulk load groups from legacy eHealth
  As a command line drive program
  I want to insert groups from eHealth   
  In order that users can access them from ViewPoint

Background:   
  Given that eHealth is being decommed
  And ViewPoint is the new user front end

Scenario: Get exported data    
  Given the following     
  When I get data from Tom   
  Then I should put it in ViewPoint    
  And I should see the new collection in ViewPoint

Scenario: Verify the existing data is valid
  Given the following
  With the given data
  I must verify that the element can be found in the device collection
  And the guid must be available