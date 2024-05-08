Feature: Provide drop downs in dynamic report form
  As a user
  I want to run reports 
  In order that I can make decisions

Background:
  Given that I've navigated to the report form

Scenario: Powerbar report
  Given the following
  When I select Powerbar report from the report selector
  I should see the Area dropdown
  An I should see the Cabinet dropdown

Scenario: Health Report
  Given the following
  When I select Health report from the report selector
  I should see Groups drop down
  And I should see the Devices drop down

Scenario: Raw Performance Report
  Given the following
  When I select "Raw Performance Data CSV" from the report selector
  I should NOT see anyt drop down

Scenario: Internet Usage Report
  Given the following
  When I select "Internet Usage" from the report selector
  I should NOT see anyt drop down  