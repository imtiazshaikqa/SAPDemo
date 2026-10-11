Feature: Country selection
  Scenario: Select a country from the dropdown
    Given I open "https://demo.guru99.com/test/newtours/register.php"
    When I select "INDIA" from the country dropdown
