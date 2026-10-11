Feature: New browser tab
  Scenario: Open a new tab and return to the original page
    Given I open "https://the-internet.herokuapp.com/windows"
    Then the page heading should be "Opening a new window"
    When I open the "Click Here" link in a new window
    Then the new window URL should match "/windows/new"
    And I should see the heading "New Window"
    And the page heading should be "Opening a new window"
    When I close the new window
    Then the new window should be closed
