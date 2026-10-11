Feature: Orange HRM navigation
  Scenario: Log in with valid credentials
    Given I log in to Orange HRM as "Admin" with password "admin123"
    Then I should see the heading "Dashboard"

  Scenario Outline: Open a navigation tab
    Given I log in to Orange HRM as "Admin" with password "admin123"
    When I click the "<tab>" navigation tab
    Then the page URL should match "<route>"

    Examples:
      | tab          | route                      |
      | Dashboard    | dashboard(?:/index)?       |
      | Admin        | admin/viewSystemUsers      |
      | PIM          | pim/viewEmployeeList       |
      | Leave        | leave/viewLeaveList        |
      | Time         | time/viewEmployeeTimesheet |
      | Recruitment  | recruitment/viewCandidates |
      | My Info      | pim/viewPersonalDetails    |
      | Performance  | performance                |
      | Directory    | directory                  |
      | Maintenance  | maintenance                |
