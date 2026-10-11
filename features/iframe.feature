Feature: Rich text editor in an iframe
  Scenario: Enter text in the editor
    Given I open "https://the-internet.herokuapp.com/iframe"
    When I enter "Hello World from Playwright!" into the rich text editor
    Then the editor should contain "Hello World from Playwright!"
