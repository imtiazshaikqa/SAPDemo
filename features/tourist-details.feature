Feature: Tourist Details applications
  Scenario: Submit ten complete applications with distinct partners
    When I submit ten complete Tourist Details applications with distinct partner companies
    Then all ten applications should have distinct partners and contact details
