Feature: JavaScript dialog handling
  Scenario: Accept a JavaScript confirm dialog
    Given I open "https://the-internet.herokuapp.com/javascript_alerts"
    When I accept the next JavaScript dialog
    And I click the "Click for JS Confirm" button
    Then the result should be "You clicked: Ok"

  Scenario: Accept a second JavaScript confirm dialog
    Given I open "https://the-internet.herokuapp.com/javascript_alerts"
    When I accept the next JavaScript dialog
    And I click the "Click for JS Confirm" button
    Then the result should be "You clicked: Ok"

  Scenario: Dismiss a JavaScript confirm dialog
    Given I open "https://the-internet.herokuapp.com/javascript_alerts"
    When I dismiss the next JavaScript dialog
    And I click the "Click for JS Confirm" button
    Then the result should be "You clicked: Cancel"
