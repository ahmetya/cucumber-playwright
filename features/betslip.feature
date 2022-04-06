@foo
Feature: Betslip Warnings and Behaviour
  As a user I want to validate betslip module behaivour and validatons

  Background: Navigation
    Given Navigate to the betson website

  Scenario Outline: Create a betslip with maximum allowed amount of bets then remove bets and assert warning
    When I click to the sportsbook link
    Then I should see sportsbook quicklink menu
    When I should navigate to "Football" in "Turkey" in "All Turkey"
    Then I should see content table
    When I extend all event tables
    And I make 21 bet selections
    Then I should see maximum bet warning message on betslip
    And There should be 20 items in betslip
    When I click Remove All Selections in betslip
    Then I should see all selections are removed
