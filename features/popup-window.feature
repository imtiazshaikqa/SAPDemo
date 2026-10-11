Feature: Popup window
  Scenario: Open and close a popup window
    Given I open "https://the-internet.herokuapp.com/windows"
    Then the page heading should be "Opening a new window"
    When I open the "Click Here" link in a new window
    Then the new window URL should match "/windows/new$"
    And the page heading should be "Opening a new window"
    And the new window heading should be "New Window"
    When I close the new window
    Then the new window should be closed
